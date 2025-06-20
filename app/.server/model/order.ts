import { eq, desc, sql } from "drizzle-orm";
import { connectDB, schema } from "~/.server/libs/db";
import type { Order, InsertOrder } from "~/.server/libs/db";

// List orders with pagination
export const listOrders = async (page = 1, pageSize = 50) => {
  const db = connectDB();
  const offset = (page - 1) * pageSize;

  const orders = await db.query.orders.findMany({
    limit: pageSize,
    offset,
    orderBy: [desc(schema.orders.created_at)],
  });

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.orders);
  const total = countResult[0].count;

  return {
    data: orders,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

// Get order by ID
export const getOrderById = async (id: Order["id"]) => {
  const db = connectDB();

  return await db.query.orders.findFirst({
    where: eq(schema.orders.id, id),
  });
};

export const getOrderBySessionId = async (id: string) => {
  const db = connectDB();

  return await db.query.orders.findFirst({
    where: eq(schema.orders.pay_session_id, id),
  });
};

// Get orders by user ID
export const getOrdersByUserId = async (userId: Order["user_id"]) => {
  const db = connectDB();

  return await db.query.orders.findMany({
    where: eq(schema.orders.user_id, userId),
    orderBy: [desc(schema.orders.created_at)],
  });
};

// Insert new order
export const insertOrder = async (value: InsertOrder) => {
  const db = connectDB();
  return await db.insert(schema.orders).values(value).returning();
};

// Update order
export const updateOrder = async (
  id: Order["id"],
  value: Partial<InsertOrder>
) => {
  const db = connectDB();

  return await db
    .update(schema.orders)
    .set(value)
    .where(eq(schema.orders.id, id))
    .returning();
};

// Delete order
export const deleteOrder = async (id: Order["id"]) => {
  const db = connectDB();

  return await db
    .delete(schema.orders)
    .where(eq(schema.orders.id, id))
    .returning();
};
