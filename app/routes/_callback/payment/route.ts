import type { Route } from "./+types/route";
import { redirect } from "react-router";

import { handleOrderComplete } from "~/.server/services/order";
import { createCreem } from "~/.server/libs/creem";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const paramsRecord: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    paramsRecord[key] = value;
  });

  const { signature: creemSignature, ...rest } = paramsRecord;
  const creem = createCreem();
  const signature = creem.createCallbackSignature(rest);

  try {
    if (creemSignature !== signature) {
      throw Error("Unvalid Signature");
    }

    await handleOrderComplete(rest.checkout_id);

    return redirect("/");
  } catch (error) {
    const message = (error as Error).message;
    console.log("Error Event: ", paramsRecord);
    console.log("Error Message: ", message);

    return redirect("/");
  }
};
