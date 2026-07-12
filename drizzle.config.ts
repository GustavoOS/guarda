import { defineConfig } from "drizzle-kit";

if (!Bun.env.DB_FILE_NAME) {
	throw new Error("DB_FILE_NAME environment variable is not set");
}

export default defineConfig({
	out: "./drizzle",
	schema: "./src/infra/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: Bun.env.DB_FILE_NAME,
	},
});
