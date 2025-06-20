import { eq, desc } from "drizzle-orm";
import { connectDB, schema } from "~/.server/libs/db";
import type { SigninLog, InsertSigninLog } from "~/.server/libs/db";

// 获取某个用户的所有登录记录
export const listSigninLogsByUserId = async (userId: SigninLog["user_id"]) => {
  const db = connectDB();

  return await db.query.signin_logs.findMany({
    where: eq(schema.signin_logs.user_id, userId),
    orderBy: desc(schema.signin_logs.created_at),
  });
};

// 插入新的登录记录
export const insertSigninLog = async (value: InsertSigninLog) => {
  const db = connectDB();

  return await db.insert(schema.signin_logs).values(value).returning();
};

// 删除某条登录记录
export const deleteSigninLog = async (id: SigninLog["id"]) => {
  const db = connectDB();

  return await db
    .delete(schema.signin_logs)
    .where(eq(schema.signin_logs.id, id))
    .returning();
};
