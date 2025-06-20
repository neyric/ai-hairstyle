import { loadEnv } from "vite";
import { defineConfig } from "drizzle-kit";

const env = loadEnv("production", process.cwd(), "");

const credentials = {
  accountId: env.ACCOUNT_ID,
  databaseId: env.DATABASE_ID,
  token: env.ACCOUNT_TOKEN,
};

export default defineConfig({
  schema: "./app/.server/drizzle/schema.ts",
  out: "./app/.server/drizzle/migrations",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: credentials,
});
