interface Metadata {
  user_id: string;
  user_email?: string;
  transactions_id: string | number;
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  currency: "EUR" | "USD";
  status: "pending" | "paid";
  type: "recurring";
  created_at: string;
  updated_at: string;
  mode: "prod" | "test" | "local";
}
export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  price: number;
  currency: "EUR" | "USD";
  billing_type: "onetime" | "recurring";
  billing_period: "once" | "every-month";
  status: "active";
  tax_mode: "exclusive";
  tax_category: "saas";
  default_success_url: string;
  created_at: string;
  updated_at: string;
  mode: "prod" | "test" | "local";
}

export interface Customer {
  id: string;
  object: string;
  email: string;
  name: string;
  country: string;
  created_at: string;
  updated_at: string;
  mode: "prod" | "test" | "local";
}

export interface Subscription {
  id: string;
  object: "subscription";
  product: Product | string;
  customer: Customer | string;
  items: any[];
  collection_method: "charge_automatically";
  status: "active";
  last_transaction_id?: string;
  last_transaction_date?: string;
  next_transaction_date?: string;
  current_period_start_date?: string;
  current_period_end_date?: string;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: Metadata;
  mode: "prod" | "test" | "local";
}

export interface Checkout {
  id: string;
  object: "checkout";
  request_id: string;
  order: Order;
  product: Product | string;
  customer: Customer | string;
  subscription: Subscription | string;
  custom_fields: [];
  status: "pending" | "completed";
  metadata: Metadata;
  mode: "prod" | "test" | "local";
}

export interface WebhookBody {
  id: string;
  eventType:
    | "checkout.completed"
    | "subscription.active"
    | "subscription.paid"
    | "subscription.canceled"
    | "subscription.expired"
    | "refund.created"
    | "subscription.update"
    | "subscription.trialing";
  created_at: 1728734325927;
  object: Checkout | Subscription | Refund;
}

export interface Refund {
  mode: "test";
  customer: Customer;
  order: Order;
  checkout: Checkout;
  transaction: {
    id: string;
    object: string;
    amount: number;
    amount_paid: number;
    currency: string;
    type: string;
    tax_country: string;
    tax_amount: number;
    status: string;
    refunded_amount: number;
    order: string;
    customer: string;
    description: string;
    created_at: number;
    mode: "test";
  };
  reason: "requested_by_customer";
  refund_currency: "USD";
  refund_amount: 499;
  status: "succeeded";
  object: "refund";
  id: "ref_6n5wbpYDjGNfO4gxrXhkMN";
  message: "refund.created";
}
