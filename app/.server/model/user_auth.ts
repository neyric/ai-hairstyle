import { eq, desc } from "drizzle-orm";
import { connectDB, schema } from "~/.server/libs/db";
import type { UserAuth, InsertUserAuth } from "~/.server/libs/db";

// 获取某个用户的所有第三方认证
export const listUserAuthsByUserId = async (userId: UserAuth["user_id"]) => {
  const db = connectDB();

  return await db.query.user_auth.findMany({
    where: eq(schema.user_auth.user_id, userId),
    orderBy: desc(schema.user_auth.created_at),
  });
};

// 根据 provider + openid 获取认证记录
export const getUserAuthByProvider = async (
  provider: string,
  openid: string
) => {
  const db = connectDB();

  return await db.query.user_auth.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.provider, provider), eq(fields.openid, openid)),
  });
};

// 插入新的认证记录
export const insertUserAuth = async (value: InsertUserAuth) => {
  const db = connectDB();

  return await db.insert(schema.user_auth).values(value).returning();
};

// 删除认证记录
export const deleteUserAuth = async (id: number) => {
  const db = connectDB();

  return await db
    .delete(schema.user_auth)
    .where(eq(schema.user_auth.id, id))
    .returning();
};
