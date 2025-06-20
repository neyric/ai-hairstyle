import { eq, asc, desc, sql, and, inArray } from "drizzle-orm";

import { connectDB, schema } from "~/.server/libs/db";
import type { AiTask, InsertAiTask } from "~/.server/libs/db";

// List AI tasks with pagination
export const listAiTasks = async (page = 1, pageSize = 50) => {
  const db = connectDB();
  const offset = (page - 1) * pageSize;

  const tasks = await db.query.ai_tasks.findMany({
    limit: pageSize,
    offset,
    orderBy: [desc(schema.ai_tasks.created_at)],
  });

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.ai_tasks);
  const total = countResult[0].count;

  return {
    data: tasks,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

// List AI tasks by user with pagination
export const listAiTasksByUser = async (
  userId: AiTask["user_id"],
  page = 1,
  pageSize = 50
) => {
  if (!userId) throw Error("UserID is required");

  const db = connectDB();
  const offset = (page - 1) * pageSize;

  const tasks = await db.query.ai_tasks.findMany({
    where: eq(schema.ai_tasks.user_id, userId),
    limit: pageSize,
    offset,
    orderBy: [desc(schema.ai_tasks.created_at)],
  });

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.ai_tasks)
    .where(eq(schema.ai_tasks.user_id, userId));
  const total = countResult[0].count;

  return {
    data: tasks,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

// Get AI task by task_no
export const getAiTaskByTaskNo = async (taskNo: AiTask["task_no"]) => {
  const db = connectDB();

  return await db.query.ai_tasks.findFirst({
    where: eq(schema.ai_tasks.task_no, taskNo),
  });
};

// Get AI task by external task_id
export const getAiTaskByTaskId = async (taskId: AiTask["task_id"]) => {
  if (!taskId) throw Error("TaskID is required");
  const db = connectDB();

  return await db.query.ai_tasks.findFirst({
    where: eq(schema.ai_tasks.task_id, taskId),
  });
};

// Get AI tasks by status
export const getAiTasksByStatus = async (status: AiTask["status"]) => {
  const db = connectDB();

  return await db.query.ai_tasks.findMany({
    where: eq(schema.ai_tasks.status, status),
    orderBy: [asc(schema.ai_tasks.estimated_start_at)],
  });
};

// Insert new AI task / batch insert
export const insertAiTask = async (value: InsertAiTask) => {
  const db = connectDB();
  return await db.insert(schema.ai_tasks).values(value).returning();
};
export const insertAiTaskBatch = async (value: InsertAiTask[]) => {
  const db = connectDB();
  return await db.insert(schema.ai_tasks).values(value).returning();
};

// Update AI task
export const updateAiTask = async (
  taskNo: AiTask["task_no"],
  value: Partial<InsertAiTask>
) => {
  const db = connectDB();

  return await db
    .update(schema.ai_tasks)
    .set(value)
    .where(eq(schema.ai_tasks.task_no, taskNo))
    .returning();
};

// Delete AI task
export const deleteAiTask = async (taskNo: AiTask["task_no"]) => {
  const db = connectDB();

  return await db
    .delete(schema.ai_tasks)
    .where(eq(schema.ai_tasks.task_no, taskNo))
    .returning();
};

// Get user's running tasks count
export const getUserRunningTasksCount = async (userId: AiTask["user_id"]) => {
  if (!userId) throw Error("UserID is required");
  const db = connectDB();

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.ai_tasks)
    .where(
      and(
        eq(schema.ai_tasks.user_id, userId),
        inArray(schema.ai_tasks.status, ["pending", "running"])
      )
    );

  return result[0].count;
};
