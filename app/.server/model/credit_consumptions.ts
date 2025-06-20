import { desc, eq, sql } from "drizzle-orm";
import { connectDB, schema } from "~/.server/libs/db";
import type {
  CreditConsumption,
  InsertCreditConsumption,
} from "~/.server/libs/db";

// 获取指定用户的积分消耗记录（分页）
export const listCreditConsumptionsByUser = async (
  userId: number,
  page = 1,
  pageSize = 50
) => {
  const db = connectDB();
  const offset = (page - 1) * pageSize;

  const data = await db.query.credit_consumptions.findMany({
    where: eq(schema.credit_consumptions.user_id, userId),
    limit: pageSize,
    offset,
    orderBy: [desc(schema.credit_consumptions.created_at)],
  });

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.credit_consumptions)
    .where(eq(schema.credit_consumptions.user_id, userId));

  const total = countResult[0].count;

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

// 获取某条积分记录的所有消耗记录
export const listConsumptionsByCreditRecordId = async (
  creditRecordId: number
) => {
  const db = connectDB();
  return await db.query.credit_consumptions.findMany({
    where: eq(schema.credit_consumptions.credit_record_id, creditRecordId),
    orderBy: [desc(schema.credit_consumptions.created_at)],
  });
};

// 新增积分消耗记录
export const insertCreditConsumption = async (
  value: InsertCreditConsumption | InsertCreditConsumption[]
) => {
  const values = Array.isArray(value) ? value : [value];

  const db = connectDB();
  return await db.insert(schema.credit_consumptions).values(values).returning();
};

// 删除积分消耗记录
export const deleteCreditConsumption = async (id: CreditConsumption["id"]) => {
  const db = connectDB();
  return await db
    .delete(schema.credit_consumptions)
    .where(eq(schema.credit_consumptions.id, id))
    .returning();
};

// 获取积分消耗记录详情
export const getCreditConsumptionById = async (id: CreditConsumption["id"]) => {
  const db = connectDB();
  return await db.query.credit_consumptions.findFirst({
    where: eq(schema.credit_consumptions.id, id),
  });
};
