/**
 * Options for the API fetcher
 */
export interface FetcherOptions extends RequestInit {
  timeout?: number;
}

/**
 * Error type for API fetch failures
 */
export interface FetcherError extends Error {
  status?: number;
  data?: any;
}

/**
 * Parameters for creating a callback signature
 */
export interface CreateCallbackSignatureParams {
  request_id?: string | null;
  checkout_id?: string | null;
  order_id?: string | null;
  customer_id?: string | null;
  subscription_id?: string | null;
  product_id?: string | null;
}

/**
 * Payload for creating a checkout
 */
export interface CreateCheckoutsPayload {
  product_id: string;
  request_id?: string;
  metadata?: Record<string, string | number>;
  success_url?: string;
  customer?: {
    email: string;
  };
  discount_code?: string;
  units?: number;
}

/**
 * Response from creating a checkout
 */
export interface CreateCheckoutsResponse {
  id: string;
  object: "checkout";
  product: string;
  unit: number | null;
  status: string;
  checkout_url: string;
  mode: "prod";
}
