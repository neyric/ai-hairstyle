import currency from "currency.js";
import dayjs from "dayjs";
import { env } from "cloudflare:workers";

import {
  insertOrder,
  updateOrder,
  getOrderBySessionId,
} from "~/.server/model/order";
import {
  insertSubscription,
  updateSubscription,
  getSubscriptionById,
} from "~/.server/model/subscriptions";

import {
  insertCreditRecord,
  updateCreditRecord,
  getCreditRecordBySourceId,
} from "~/.server/model/credit_record";
import { insertCreditConsumption } from "~/.server/model/credit_consumptions";

import { createCreem } from "~/.server/libs/creem";
import type { Customer, Subscription } from "~/.server/libs/creem/types";
import type { User } from "~/.server/libs/db";

import { PRICING_LIST } from "~/.server/constants/pricing";

function generateUniqueOrderNo(prefix = "ORD") {
  const dateTimePart = dayjs().format("YYYYMMDDHHmmssSSS");
  const randomPart = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  return [prefix, dateTimePart, randomPart].join("");
}

interface CreateOrderOptions {
  type: "once" | "monthly" | "yearly"; // 订单类型，一次性购买、月订阅、年订阅
  product_id: string;
  product_name: string;
  price: number; // 支付金额，单位元
  credits?: number; // 订单购买的 Credits 数量（仅 once 订单）
  plan_id?: string; // 订阅计划的编码
}
export const createOrder = async (payload: CreateOrderOptions, user: User) => {
  const orderNo = generateUniqueOrderNo();

  const [order] = await insertOrder({
    order_no: orderNo,
    order_detail: payload,
    user_id: user.id,
    product_id: payload.product_id,
    product_name: payload.product_name,
    amount: currency(payload.price).intValue,
    status: "pending",
  });

  const creem = createCreem();
  const session = await creem.createCheckout({
    product_id: order.product_id,
    customer: { email: user.email },
    success_url: new URL(
      "/callback/payment",
      import.meta.env.PROD ? env.DOMAIN : "http://localhost:5173"
    ).toString(),
  });

  await updateOrder(order.id, {
    pay_session_id: session.id,
    pay_provider: "creem",
    session_detail: session,
  });

  return session;
};

export const handleOrderComplete = async (checkoutId: string) => {
  const creem = createCreem();
  const checkout = await creem.getCheckout(checkoutId);

  if (!checkout || checkout.status !== "completed") {
    throw Error("Invalid checkout");
  }

  const order = await getOrderBySessionId(checkout.id);
  if (!order) throw Error("Invalid transaction");
  if (order.status !== "pending") {
    throw Error(`Transaction is ${order.status}`);
  }
  const customer = checkout.customer as Customer;
  await updateOrder(order.id, {
    paid_at: new Date(),
    paid_email: customer.email,
    paid_detail: checkout,
    status: "processing",
  });

  const orderDetail = order.order_detail as CreateOrderOptions;
  const { type, credits, plan_id } = orderDetail;

  if (type === "once") {
    if (credits) {
      await insertCreditRecord({
        user_id: order.user_id,
        credits: credits,
        remaining_credits: credits,
        trans_type: "purchase",
        source_type: "order",
        source_id: order.order_no,
      });
    }

    const [result] = await updateOrder(order.id, {
      status: "completed",
    });

    return result;
  } else {
    const plan = PRICING_LIST.find((item) => item.id === plan_id);
    const hasError = !plan;

    if (hasError) {
      const [result] = await updateOrder(order.id, {
        status: "completed",
        is_error: true,
        error_msg: "Unvalid Subscription Plan",
      });

      return result;
    } else {
      const expiredAt = dayjs()
        .add(1, orderDetail.type === "yearly" ? "year" : "month")
        .endOf("day")
        .toDate();
      const subscription = checkout.subscription as Subscription;
      const [sub] = await insertSubscription({
        user_id: order.user_id,
        plan_type: plan.id,
        status: "active",
        interval: orderDetail.type === "yearly" ? "year" : "month",
        interval_count: 1,
        platform_sub_id: subscription.id,
        start_at: dayjs().startOf("day").toDate(),
        expired_at: expiredAt,
        last_payment_at: new Date(),
      });

      if (plan.limit.credits) {
        await insertCreditRecord({
          user_id: order.user_id,
          credits: plan.limit.credits,
          remaining_credits: plan.limit.credits,
          trans_type: "subscription",
          source_type: "order",
          source_id: order.order_no,
          expired_at: expiredAt,
        });
      }

      const [result] = await updateOrder(order.id, {
        status: "completed",
        sub_id: subscription.id,
        subscription_id: sub.id,
      });

      return result;
    }
  }
};

export const handleOrderRefund = async (checkoutId: string) => {
  const creem = createCreem();
  const checkout = await creem.getCheckout(checkoutId);
  if (!checkout || checkout.status !== "completed") {
    throw Error("Invalid checkout");
  }

  const order = await getOrderBySessionId(checkout.id);

  if (!order) throw Error("Invalid transaction");
  if (order.status !== "completed") {
    throw Error(`Transaction is ${order.status}`);
  }

  if (order.subscription_id) {
    const subscription = await getSubscriptionById(order.subscription_id);
    if (subscription) {
      await updateSubscription(subscription.id, {
        status: "cancelled",
        expired_at: new Date(),
        cancel_at: new Date(),
      });
    }
  }

  const credit = await getCreditRecordBySourceId(order.order_no);
  if (credit && credit.remaining_credits > 0) {
    await updateCreditRecord(credit.id, { remaining_credits: 0 });
    await insertCreditConsumption({
      user_id: credit.user_id,
      credits: credit.remaining_credits,
      credit_record_id: credit.id,
      reason: "Order Refund",
    });
  }

  const [result] = await updateOrder(order.id, {
    status: "refunded",
  });

  return result;
};
