export interface PRODUCT {
  price: number;
  credits: number;
  product_id: string;
  product_name: string;
  type: "once" | "monthly" | "yearly";
}

export const CREDITS_PRODUCT: PRODUCT = {
  price: 9,
  credits: 100,
  product_id: import.meta.env.PROD
    ? "prod_3q2PT9pqzfw5URK7TdIhyb"
    : "prod_tMa1e6wOR5SnpYzLKUVaP",
  product_name: "Credits Pack",
  type: "once",
};

export const PRODUCTS_LIST = [CREDITS_PRODUCT];
