import type { Route } from "./+types/route";
import { data } from "react-router";

import { updateTaskStatusByTaskId } from "~/.server/services/ai-tasks";
import type { GPT4oTaskCallbackJSON } from "~/.server/aisdk";

export const action = async ({ request }: Route.ActionArgs) => {
  const json = await request.json<GPT4oTaskCallbackJSON>();
  if (!json.data?.taskId) return data({});
  await updateTaskStatusByTaskId(json.data.taskId);

  return data({});
};
