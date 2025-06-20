import { env } from "cloudflare:workers";

import { drizzle } from "drizzle-orm/d1";
import * as schema from "~/.server/drizzle/schema";

export * from "~/.server/drizzle/schema";

function connectDB() {
  const db = drizzle(env.DB, { schema });

  return db;
}

export { schema, connectDB };
