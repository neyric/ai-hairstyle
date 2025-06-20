import { eq, asc, desc, sql } from "drizzle-orm";

import { connectDB, schema } from "~/.server/libs/db";
import type { User, InsertUser } from "~/.server/libs/db";

// List users with pagination
export const listUsers = async (page = 1, pageSize = 50) => {
  const db = connectDB();
  const offset = (page - 1) * pageSize;

  const users = await db.query.users.findMany({
    limit: pageSize,
    offset,
    orderBy: [desc(schema.users.created_at)],
  });

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.users);
  const total = countResult[0].count;

  return {
    data: users,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

// Get user by ID
export const getUserById = async (userId: User["id"]) => {
  const db = connectDB();

  return await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  });
};

// Get user by email
export const getUserByEmail = async (email: User["email"]) => {
  const db = connectDB();

  return await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });
};

// Insert new user
export const insertUser = async (value: InsertUser) => {
  const db = connectDB();
  return await db.insert(schema.users).values(value).returning();
};

// Update user
export const updateUser = async (
  userId: User["id"],
  value: Partial<InsertUser>
) => {
  const db = connectDB();

  return await db
    .update(schema.users)
    .set(value)
    .where(eq(schema.users.id, userId))
    .returning();
};

// Delete user
export const deleteUser = async (userId: User["id"]) => {
  const db = connectDB();

  return await db
    .delete(schema.users)
    .where(eq(schema.users.id, userId))
    .returning();
};

// Get user with relations
export const getUserWithRelations = async (userId: User["id"]) => {
  const db = connectDB();

  return await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
    with: {
      auths: true,
      credits: {
        orderBy: desc(schema.credit_records.created_at),
      },
      credits_consumptions: {
        orderBy: desc(schema.credit_consumptions.created_at),
      },
      signin_logs: {
        orderBy: asc(schema.signin_logs.created_at),
      },
      orders: {
        orderBy: desc(schema.orders.created_at),
      },
      subscriptions: {
        orderBy: desc(schema.subscriptions.created_at),
      },
    },
  });
};
