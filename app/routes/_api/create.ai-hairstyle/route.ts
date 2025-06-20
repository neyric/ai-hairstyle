import type { Route } from "./+types/route";
import { data } from "react-router";

import { createAiHairstyleSchema } from "~/.server/schema/task";
import { getSessionHandler } from "~/.server/libs/session";

import { createAiHairstyle } from "~/.server/services/ai-tasks";

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method.toLowerCase() !== "post") {
    throw new Response("Not Found", { status: 404 });
  }

  const form = await request.formData();
  const raw = Object.fromEntries(form.entries());
  const json = createAiHairstyleSchema.parse(raw);

  const [session] = await getSessionHandler(request);
  const user = session.get("user");
  if (!user) throw new Response("Unauthorized", { status: 401 });

  try {
    const result = await createAiHairstyle(json, user);
    return data(result);
  } catch (e) {
    console.error("Create ai hairstyle error");
    console.error(e);
    throw new Response("Server Error", { status: 500 });
  }
};
export type AiHairstyleResult = Awaited<ReturnType<typeof action>>["data"];
