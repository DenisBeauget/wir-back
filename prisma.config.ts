import { defineConfig, env } from "prisma/config";
import { config } from "dotenv";


config()

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/wir?schema=public",
  },
});
