export interface PLAN {
  id: string;
  popular: boolean;
  product_id: { monthly: string; yearly: string } | null;
  price: { monthly: number; yearly: number };
  name: string;
  description: string;
  limit: {
    adblock: boolean; // 是否关闭广告
    watermarks: boolean; // 生成的结果是否显示水印
    highResolution: boolean; // 是否生成高质量图像
    fullStyles: boolean; // 是否允许使用完整风格
    credits: number; // 每月赠送积分
    private: boolean; // 是否私有化生成
    features: boolean; // 允许使用实验性功能
  };
}

export const PREMIUM_PLAN: PLAN = {
  id: "premium",
  popular: true,
  price: { monthly: 4.99, yearly: 49.9 },
  product_id: {
    monthly: "xxx", // 月订阅商品编码
    yearly: "xxx", // 年订阅商品编码
  },
  name: "Premium Plan",
  description:
    "Support full styles and Ad-free experience, get no watermarks and high resolution image.",
  limit: {
    adblock: true,
    watermarks: false,
    highResolution: true,
    fullStyles: true,
    credits: 100,
    private: true,
    features: false,
  },
};

export const PRICING_LIST = [] as PLAN[];
export const PLANS = {} as Record<string, PLAN>;
