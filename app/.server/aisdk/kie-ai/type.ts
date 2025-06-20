export interface ApiResult<T = any> {
  code: number;
  msg: string;
  data: T;
}

export type GPT4oAspect = "3:2" | "1:1" | "2:3";

export interface Create4oTaskOptions {
  filesUrl?: string[];
  prompt: string;
  size: GPT4oAspect;
  callBackUrl?: string;
  nVariants?: "1" | "2" | "4";
}
export interface GPT4oTask {
  taskId: string;
  paramJson: string;
  completeTime: string | null;
  response: {
    resultUrls: string[];
  } | null;
  successFlag: 0 | 1;
  status: "GENERATING" | "SUCCESS" | "CREATE_TASK_FAILED" | "GENERATE_FAILED";
  errorCode: number;
  errorMessage: string;
  createTime: string;
  progress: string;
}

export type GPT4oTaskCallbackJSON = ApiResult<{
  info: { result_urls: string[] };
  taskId: string;
}>;

export type KontextAspect =
  | "21:9"
  | "16:9"
  | "4:3"
  | "1:1"
  | "3:4"
  | "9:16"
  | "16:21";

export interface CreateKontextOptions {
  prompt: string;
  inputImage?: string;
  enableTranslation?: boolean;
  aspectRatio?: KontextAspect;
  outputFormat?: "jpeg" | "png";
  promptUpsampling?: boolean;
  model?: "flux-kontext-pro" | "flux-kontext-max";
  callBackUrl?: string;
  watermark?: string;
}

export interface KontextTask {
  taskId: string;
  paramJson: string;
  completeTime: string | null;
  response: {
    originImageUrl: string;
    resultImageUrl: string;
  } | null;
  successFlag: 0 | 1 | 2 | 3; // status: "GENERATING" | "SUCCESS" | "CREATE_TASK_FAILED" | "GENERATE_FAILED";
  errorCode: number;
  errorMessage: string;
  createTime: string;
}
