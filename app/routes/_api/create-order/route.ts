import type { Route } from "./+types/route";
import { data } from "react-router";

import { getSessionHandler } from "~/.server/libs/session";
import { createOrder } from "~/.server/services/order";

import { PRODUCTS_LIST } from "~/.server/constants";

export async function action({ request }: Route.ActionArgs) {
  const raw = await request.json<{ product_id: string }>();
  const { product_id } = raw;
  const product = PRODUCTS_LIST.find((item) => item.product_id === product_id);
  if (!product) throw new Response("Not Found", { status: 404 });

  const [session] = await getSessionHandler(request);
  const user = session.get("user");
  if (!user) throw new Response("Unauthorized", { status: 401 });

  const result = await createOrder(
    {
      credits: product.credits,
      price: product.price,
      product_id: product.product_id,
      product_name: product.product_name,
      type: product.type,
    },
    user
  );

  return data(result);
}
