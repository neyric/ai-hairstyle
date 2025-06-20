import { env } from "cloudflare:workers";

import type {
  ApiResult,
  Create4oTaskOptions,
  GPT4oTaskCallbackJSON,
  GPT4oTask,
} from "./type";
import type { CreateKontextOptions, KontextTask } from "./type";

// Create GPT 4o Options
export type { Create4oTaskOptions, GPT4oTask, GPT4oTaskCallbackJSON };

// Create Kontext Options
export type { CreateKontextOptions, KontextTask };

interface KieAIModelConfig {
  accessKey: string;
}

interface CreateTaskResult {
  taskId: string;
}

interface QueryTaskParams {
  taskId: string;
}

interface Get4oDirectDownloadURLOptions {
  taskId: string;
  url: string;
}

export class KieAI {
  private API_URL = new URL("https://kieai.erweima.ai");
  private readonly config: KieAIModelConfig = { accessKey: env.KIEAI_APIKEY };

  constructor(config?: KieAIModelConfig) {
    if (config) this.config = config;
  }

  private async fetch<T = any>(
    path: string,
    data?: Record<string, any>,
    init: RequestInit = {}
  ) {
    const { headers, method = "get", ...rest } = init;

    const url = new URL(path, this.API_URL);
    const options: RequestInit = {
      ...rest,
      method,
      headers: {
        "content-type": "application/json",
        ...headers,
        Authorization: `Bearer ${this.config.accessKey}`,
      },
    };

    if (data) {
      if (method.toLowerCase() === "get") {
        Object.entries(data).forEach(([key, value]) => {
          url.searchParams.set(key, value);
        });
      } else {
        options.body = JSON.stringify(data);
      }
    }

    const response = await fetch(url, options);
    const json = await response.json<ApiResult<T>>();

    if (!response.ok || json.code !== 200) {
      throw {
        code: json.code ?? response.status,
        message: json.msg ?? response.statusText,
        data: json ? json.data : json,
      };
    }

    return json;
  }

  async create4oTask(payload: Create4oTaskOptions) {
    const result = await this.fetch<CreateTaskResult>(
      "/api/v1/gpt4o-image/generate",
      payload,
      {
        method: "post",
      }
    );

    return result.data;
  }

  async query4oTaskDetail(params: QueryTaskParams) {
    const result = await this.fetch<GPT4oTask>(
      "/api/v1/gpt4o-image/record-info",
      params
    );

    return result.data;
  }

  async get4oDownloadURL(params: Get4oDirectDownloadURLOptions) {
    console.log("params", params);

    const result = await this.fetch<string>(
      "/api/v1/gpt4o-image/download-url",
      params,
      { method: "post" }
    );
    console.log("result", result);

    return result.data;
  }

  async getCreditsRemaining() {
    const result = await this.fetch<number>("/api/v1/chat/credit");

    return result.data;
  }

  async createKontextTask(payload: CreateKontextOptions) {
    const result = await this.fetch<CreateTaskResult>(
      "/api/v1/flux/kontext/generate",
      payload,
      {
        method: "post",
      }
    );

    return result.data;
  }

  async queryKontextTask(params: QueryTaskParams) {
    const result = await this.fetch<KontextTask>(
      "/api/v1/flux/kontext/record-info",
      params
    );

    return result.data;
  }
}
