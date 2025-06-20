import { eq, and, desc, sql } from "drizzle-orm";
import { connectDB, schema } from "~/.server/libs/db";
import type { Subscription, InsertSubscription } from "~/.server/libs/db";

// List subscriptions with pagination
export const listSubscriptions = async (page = 1, pageSize = 50) => {
  const db = connectDB();
  const offset = (page - 1) * pageSize;

  const subscriptions = await db.query.subscriptions.findMany({
    limit: pageSize,
    offset,
    orderBy: [desc(schema.subscriptions.created_at)],
  });

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.subscriptions);
  const total = countResult[0].count;

  return {
    data: subscriptions,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

// Get subscription by ID
export const getSubscriptionById = async (id: Subscription["id"]) => {
  const db = connectDB();

  return await db.query.subscriptions.findFirst({
    where: eq(schema.subscriptions.id, id),
  });
};

// Get subscriptions by user ID
export const getSubscriptionsByUserId = async (
  userId: Subscription["user_id"]
) => {
  const db = connectDB();

  return await db.query.subscriptions.findMany({
    where: eq(schema.subscriptions.user_id, userId),
    orderBy: [desc(schema.subscriptions.created_at)],
  });
};

export const getActiveSubscriptionsByUserId = async (
  userId: Subscription["user_id"]
) => {
  const db = connectDB();

  return await db.query.subscriptions.findFirst({
    where: and(
      eq(schema.subscriptions.user_id, userId),
      eq(schema.subscriptions.status, "active")
    ),
    orderBy: [desc(schema.subscriptions.created_at)],
  });
};

// Insert new subscription
export const insertSubscription = async (value: InsertSubscription) => {
  const db = connectDB();
  return await db.insert(schema.subscriptions).values(value).returning();
};

// Update subscription
export const updateSubscription = async (
  id: Subscription["id"],
  value: Partial<InsertSubscription>
) => {
  const db = connectDB();

  return await db
    .update(schema.subscriptions)
    .set(value)
    .where(eq(schema.subscriptions.id, id))
    .returning();
};

// Delete subscription
export const deleteSubscription = async (id: Subscription["id"]) => {
  const db = connectDB();

  return await db
    .delete(schema.subscriptions)
    .where(eq(schema.subscriptions.id, id))
    .returning();
};
