CREATE TABLE `files_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`blobName` text NOT NULL,
	`originalName` text NOT NULL,
	`mimeType` text NOT NULL,
	`uploadedBy` integer NOT NULL,
	`uploadedAt` text DEFAULT (CURRENT_TIMESTAMP),
	`uploadedCompletedAt` text,
	`coordinates` text,
	`createdAt` text NOT NULL,
	CONSTRAINT `fk_files_table_uploadedBy_users_table_id_fk` FOREIGN KEY (`uploadedBy`) REFERENCES `users_table`(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`externalId` text NOT NULL UNIQUE
);
