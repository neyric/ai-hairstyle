import { nanoid } from "nanoid";
import { sql, relations } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

// ======================= 表定义 =======================

export const users = sqliteTable(
  "users",
  {
    id: integer().primaryKey({ autoIncrement: true }), // 主键，自增ID
    email: text().notNull().unique(), // 用户邮箱，唯一
    password: text(), // 用户密码（可为空，适配第三方登录）
    nickname: text().notNull(), // 昵称
    avatar_url: text(), // 头像地址
    created_at: integer({ mode: "timestamp" })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => [
    index("email_unique_idx").on(table.email), // 创建email索引以确保唯一性
  ]
);

export const user_auth = sqliteTable("user_auth", {
  id: integer().primaryKey({ autoIncrement: true }), // 主键
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // 外键：关联users
  provider: text().notNull(), // 第三方平台名称
  openid: text().notNull(), // 第三方平台唯一标识
  created_at: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`), // 创建时间
});

export const signin_logs = sqliteTable("signin_logs", {
  id: integer().primaryKey({ autoIncrement: true }),
  session: text(), // 该登录使用的 session id
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // 外键：关联用户
  type: text().notNull(), // 登录方式，如 email、google
  ip: text(), // 登录时的 IP 地址
  user_agent: text(), // 用户 UA
  headers: text({ mode: "json" }), // 请求头（JSON）
  created_at: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`), // 登录时间
});

export const orders = sqliteTable("orders", {
  id: integer().primaryKey({ autoIncrement: true }), // 主键
  order_no: text().unique().notNull(), // 订单编号（唯一）
  order_detail: text({ mode: "json" }), // 商品的明细数据，即创建 order 时提供的参数，支付完成后依据该参数进行逻辑
  created_at: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`), // 创建时间
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // 外键：用户ID
  product_id: text().notNull(), // 商品ID，对应后 Provider 后台的商品 ID
  product_name: text().notNull(), // 商品名称
  amount: integer().notNull(), // 支付金额（单位：分）
  status: text({
    enum: [
      "pending", // 等待支付（订单已创建但尚未支付）
      "paid", // 已支付（支付成功）
      "processing", // 支付后正在处理（可选，适用于需异步处理场景）
      "completed", // 已完成（服务或商品交付完毕）
      "refunding", // 退款中（用户申请退款或系统发起）
      "refunded", // 已退款
      "cancelled", // 已取消（未支付前用户主动取消）
      "expired", // 已过期（如未支付并超过有效期）
    ],
  }).notNull(), // 订单状态
  pay_session_id: text().unique(), // 支付会话ID
  pay_provider: text({ enum: ["creem"] }).default("creem"), // 支付服务提供商（如 Creem）
  session_detail: text({ mode: "json" }), // 订单详情，创建 session 获取到的 JSON 数据
  paid_at: integer({ mode: "timestamp" }), // 实际支付时间
  paid_email: text(), // 支付时填写的邮箱
  paid_detail: text({ mode: "json" }), // 支付明细，支付完成后最终获取到的支付明细数据
  is_error: integer({ mode: "boolean" }),
  error_msg: text(),
  sub_id: text(), // 第三方订阅ID（如 Creem subscription ID）
  subscription_id: integer().references(() => subscriptions.id, {
    onDelete: "set null",
  }), // 关联的订阅记录（可为空）
});

export const credit_records = sqliteTable("credit_records", {
  id: integer().primaryKey({ autoIncrement: true }), // 积分记录编码
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // 对应的用户
  credits: integer().notNull(), // 本次获得积分数量
  remaining_credits: integer().notNull(), // 当前剩余未消耗积分（默认为 credits 值）
  trans_type: text({
    enum: [
      "initilize", // 初始积分
      "purchase", // 购买的积分
      "subscription", // 订阅赠送的积分
      "adjustment", // 手动赠送的积分
    ],
  }).notNull(),
  source_type: text(), // 关联的实体类型
  source_id: text(), // 可选的关联实体ID（如 order_no / subscription_id）
  expired_at: integer({ mode: "timestamp" }), // 有效期字段（可为空表示永久）
  note: text(), // 该 credit 的备注信息
  created_at: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updated_at: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`)
    .$onUpdateFn(() => new Date()),
});

export const credit_consumptions = sqliteTable("credit_consumptions", {
  id: integer().primaryKey({ autoIncrement: true }),
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  credits: integer().notNull(), // 本次消耗的积分数量
  credit_record_id: integer()
    .notNull()
    .references(() => credit_records.id, {
      onDelete: "cascade",
    }), // 消耗自哪一笔积分记录
  source_type: text(), // 消耗的实体
  source_id: text(), // 消耗的实体 ID 例如（task_no）
  reason: text(), // 消耗的理由
  created_at: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: integer().primaryKey({ autoIncrement: true }), // 主键
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // 外键：用户ID
  plan_type: text().notNull(), // 订阅计划类型（数据维护在变量）
  status: text({
    enum: [
      "active", // 订阅激活中（用户已订阅，正在使用中）
      "cancelled", // 订阅已取消（用户主动取消，或平台取消）
      "expired", // 订阅已过期（即到期未支付）
    ],
  }).notNull(), // 当前订阅状态
  interval: text({ enum: ["month", "year"] }).default("month"), // 周期
  interval_count: integer().default(1), // 周期间隔数量（例如每 1 月 / 每 1 年）
  platform_sub_id: text(), // 第三方平台订阅ID（即 Creem 的 Subscribe ID）
  start_at: integer({ mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ), // 启用时间
  expired_at: integer({ mode: "timestamp" }), // 到期时间（可为空）
  last_payment_at: integer({ mode: "timestamp" }), // 最近支付时间
  cancel_at: integer({ mode: "timestamp" }), // 取消时间（主动取消时间）
  created_at: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`), // 创建时间
});

export const ai_tasks = sqliteTable("ai_tasks", {
  task_no: text()
    .primaryKey()
    .$defaultFn(() => nanoid()), // Primary KEY
  user_id: integer().references(() => users.id, { onDelete: "cascade" }),
  created_at: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  status: text({
    enum: [
      "pending", // 等待中（等待调度执行）
      "running", // 执行中
      "succeeded", // 成功完成
      "failed", // 执行失败
    ],
  })
    .notNull()
    .default("pending"), // 当前任务状态
  input_params: text({ mode: "json" }).notNull(), // 用户发起任务时的参数（JSON）
  estimated_start_at: integer({ mode: "timestamp" }).notNull(), // 预计开始时间（程序内计算得出，创建 task 时计算）
  ext: text({ mode: "json" })
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}), // 额外的附加信息，例如 hairstyle_name / hairstyle_color
  // 系统内结果数据
  started_at: integer({ mode: "timestamp" }), // 实际任务开始时间
  completed_at: integer({ mode: "timestamp" }), // 任务完成时间
  aspect: text().default("1:1"),
  result_url: text(), // 返回的结果图片地址
  fail_reason: text(), // 失败原因（从外部系统的返回结果中获取）
  // 外部接口提供方数据
  provider: text({ enum: ["kie_4o", "kie_kontext"] }), // 外部系统的提供方
  task_id: text(), // 外部系统的任务编号，任务未开始时可以为 null
  request_param: text({ mode: "json" }), // 调用外部系统提供的参数
  result_data: text({ mode: "json" }), // 执行完成后结果（JSON，可为空）
});

// ======================= 关系定义 =======================

export const users_relations = relations(users, ({ many }) => ({
  auths: many(user_auth), // 一对多：用户拥有多个第三方认证
  signin_logs: many(signin_logs), // 登录记录
  credits: many(credit_records), // 一对多：用户的积分记录
  credits_consumptions: many(credit_consumptions),
  orders: many(orders), // 一对多：订单
  subscriptions: many(subscriptions), // 一对多：订阅
  ai_tasks: many(ai_tasks),
}));

export const user_auth_relations = relations(user_auth, ({ one }) => ({
  user: one(users, {
    fields: [user_auth.user_id],
    references: [users.id],
  }),
}));

export const signin_logs_relations = relations(signin_logs, ({ one }) => ({
  user: one(users, {
    fields: [signin_logs.user_id],
    references: [users.id],
  }),
}));

export const orders_relations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.user_id],
    references: [users.id],
  }),
  subscription: one(subscriptions, {
    fields: [orders.subscription_id],
    references: [subscriptions.id],
  }),
}));

export const credits_relations = relations(credit_records, ({ one, many }) => ({
  user: one(users, {
    fields: [credit_records.user_id],
    references: [users.id],
  }),
  consumptions: many(credit_consumptions), // 一条 credit_record 可被多次消耗
}));

export const credit_consumptions_relations = relations(
  credit_consumptions,
  ({ one }) => ({
    user: one(users, {
      fields: [credit_consumptions.user_id],
      references: [users.id],
    }),
    credit_record: one(credit_records, {
      fields: [credit_consumptions.credit_record_id],
      references: [credit_records.id],
    }),
  })
);

export const subscriptions_relations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.user_id],
    references: [users.id],
  }),
}));

export const ai_tasks_relations = relations(ai_tasks, ({ one }) => ({
  user: one(users, {
    fields: [ai_tasks.user_id],
    references: [users.id],
  }),
}));

// ======================= 类型定义 =======================

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type UserAuth = typeof user_auth.$inferSelect;
export type InsertUserAuth = typeof user_auth.$inferInsert;

export type SigninLog = typeof signin_logs.$inferSelect;
export type InsertSigninLog = typeof signin_logs.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type Credit = typeof credit_records.$inferSelect;
export type InsertCredit = typeof credit_records.$inferInsert;

export type CreditConsumption = typeof credit_consumptions.$inferSelect;
export type InsertCreditConsumption = typeof credit_consumptions.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

export type AiTask = typeof ai_tasks.$inferSelect;
export type InsertAiTask = typeof ai_tasks.$inferInsert;
