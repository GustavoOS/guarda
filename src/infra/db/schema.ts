import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { Point } from "geojson";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  externalId: text().notNull().unique()
});

export const filesTable = sqliteTable("files_table", {
    id: int().primaryKey({ autoIncrement: true }),
    blobName: text().notNull(),
    originalName: text().notNull(),
    mimeType: text().notNull(),
    uploadedBy: int().notNull().references(() => usersTable.id),
    uploadedAt: text().default(sql`(CURRENT_TIMESTAMP)`),
    uploadedCompletedAt: text(),
    coordinates: text({mode: "json"}).$type<Point>(),
    createdAt: text().notNull()
});
