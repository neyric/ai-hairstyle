import { desc, eq, and, isNull, gt, or } from "drizzle-orm";
import { connectDB, schema } from "~/.server/libs/db";
import type { Credit, InsertCredit } from "~/.server/libs/db";

// 获取指定用户的积分记录（分页）
export const listCreditRecordsByUser = async (userId: Credit["user_id"]) => {
  const db = connectDB();

  const list = await db.query.credit_records.findMany({
    where: eq(schema.credit_records.user_id, userId),
    orderBy: [desc(schema.credit_records.created_at)],
  });

  return list;
};

export const listActiveCreditsByUser = async (userId: Credit["user_id"]) => {
  const db = connectDB();

  const list = await db.query.credit_records.findMany({
    where: and(
      eq(schema.credit_records.user_id, userId),
      or(
        isNull(schema.credit_records.expired_at),
        gt(schema.credit_records.expired_at, new Date())
      )
    ),
    orderBy: [desc(schema.credit_records.created_at)],
  });

  return list;
};

// 新增积分记录
export const insertCreditRecord = async (value: InsertCredit) => {
  const db = connectDB();
  return await db.insert(schema.credit_records).values(value).returning();
};

// 更新积分记录（一般用于更新剩余积分或备注）
export const updateCreditRecord = async (
  id: Credit["id"],
  value: Partial<InsertCredit>
) => {
  const db = connectDB();
  return await db
    .update(schema.credit_records)
    .set(value)
    .where(eq(schema.credit_records.id, id))
    .returning();
};

// 删除积分记录
export const deleteCreditRecord = async (id: Credit["id"]) => {
  const db = connectDB();
  return await db
    .delete(schema.credit_records)
    .where(eq(schema.credit_records.id, id))
    .returning();
};

// 获取单条积分记录
export const getCreditRecordById = async (id: Credit["id"]) => {
  const db = connectDB();
  return await db.query.credit_records.findFirst({
    where: eq(schema.credit_records.id, id),
  });
};
// 获取单条积分记录
export const getCreditRecordBySourceId = async (id: Credit["source_id"]) => {
  if (!id) throw Error("Source ID is required");

  const db = connectDB();
  return await db.query.credit_records.findFirst({
    where: eq(schema.credit_records.source_id, id),
  });
};
