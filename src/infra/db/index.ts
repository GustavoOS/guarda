import { drizzle } from 'drizzle-orm/bun-sqlite';

const db = drizzle(Bun.env.DB_FILE_NAME!);
