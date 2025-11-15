import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 8081,
    nodeEnv: process.env.NODE_ENV || 'dev',
    databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/wir?schema=public"
};