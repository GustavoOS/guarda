import { drizzle } from 'drizzle-orm/libsql';

if(!Bun.env.DB_FILE_NAME) {
    throw new Error("DB_FILE_NAME environment variable is not set");
}
export const db = drizzle(Bun.env.DB_FILE_NAME);
