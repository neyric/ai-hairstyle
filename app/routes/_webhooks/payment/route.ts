import type { Route } from "./+types/route";

import {
  handleOrderComplete,
  handleOrderRefund,
} from "~/.server/services/order";
import { createCreem } from "~/.server/libs/creem";
import type { WebhookBody, Checkout, Refund } from "~/.server/libs/creem/types";

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method.toLowerCase() !== "post") {
    return new Response("Fail Method", { status: 405 });
  }
  const body = await request.text();

  const creemSignature = request.headers.get("creem-signature");
  const creem = createCreem();
  const signature = creem.createWebhookSignature(body);

  try {
    if (creemSignature !== signature) {
      throw Error("Unvalid Signature");
    }

    const { eventType, ...rest } = JSON.parse(body) as WebhookBody;

    if (eventType === "checkout.completed") {
      const checkout = rest.object as Checkout;
      await handleOrderComplete(checkout.id);
    } else if (eventType === "refund.created") {
      const v = rest.object as Refund;
      const { checkout } = v;

      await handleOrderRefund(checkout.id);
    }
    return Response.json({}, { status: 200 });
  } catch (error) {
    const message = (error as Error).message;
    console.log("Error Event: ", body);
    console.log("Error Message: ", message);

    return Response.json({ message }, { status: 400 });
  }
};
