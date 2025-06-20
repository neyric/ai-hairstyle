import currency from "currency.js";

import {
  listActiveCreditsByUser,
  updateCreditRecord,
} from "~/.server/model/credit_record";
import { insertCreditConsumption } from "~/.server/model/credit_consumptions";

import type { User, InsertCreditConsumption } from "~/.server/libs/db";

export const getUserCredits = async (user: User) => {
  const list = await listActiveCreditsByUser(user.id);
  const credits = list.reduce(
    (prev, item) => prev.add(item.remaining_credits),
    currency(0)
  );

  return { balance: credits.value, list };
};

export const consumptionsCredits = async (
  user: User,
  payload: {
    credits: number;
    source_type?: string;
    source_id?: string;
    reason?: string;
  }
) => {
  const { balance, list } = await getUserCredits(user);
  if (balance < payload.credits) {
    throw Error("Credits Insufficient");
  }

  // 按过期时间排序：有过期时间的按时间升序排列，无过期时间的放在最后
  const sortedList = list
    .filter((item) => item.remaining_credits > 0) // 只处理有剩余积分的记录
    .sort((a, b) => {
      if (a.expired_at && !b.expired_at) return -1; // 如果 a 有过期时间，b 没有，a 优先
      if (!a.expired_at && b.expired_at) return 1; // 如果 a 没有过期时间，b 有，b 优先

      // 如果都有过期时间，按时间升序排列（先过期的优先）
      if (a.expired_at && b.expired_at) {
        return a.expired_at.valueOf() - b.expired_at.valueOf();
      }
      // 如果都没有过期时间，按创建时间升序排列（先创建的优先）
      return a.created_at.valueOf() - b.created_at.valueOf();
    });

  let remainingCreditsToConsume = payload.credits;
  const consumptionRecords: InsertCreditConsumption[] = [];

  // 开始扣除积分
  for (const creditRecord of sortedList) {
    if (remainingCreditsToConsume <= 0) break;

    const availableCredits = creditRecord.remaining_credits;
    const creditsToConsume = Math.min(
      availableCredits,
      remainingCreditsToConsume
    );

    if (creditsToConsume > 0) {
      // 更新积分记录的剩余数量
      const newRemainingCredits = availableCredits - creditsToConsume;
      await updateCreditRecord(creditRecord.id, {
        remaining_credits: newRemainingCredits,
      });

      // 创建消费记录
      const consumptionRecord: InsertCreditConsumption = {
        user_id: user.id,
        credits: creditsToConsume,
        credit_record_id: creditRecord.id,
        source_type: payload.source_type || null,
        source_id: payload.source_id || null,
        reason: payload.reason || null,
      };

      consumptionRecords.push(consumptionRecord);
      remainingCreditsToConsume -= creditsToConsume;
    }
  }

  // 批量插入消费记录
  if (consumptionRecords.length > 0) {
    await insertCreditConsumption(consumptionRecords);
  }

  return {
    consumed: payload.credits,
    consumptionRecords: consumptionRecords.length,
    remainingBalance: balance - payload.credits,
  };
};
