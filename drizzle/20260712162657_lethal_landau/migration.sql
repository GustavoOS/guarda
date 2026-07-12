CREATE TABLE `files_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`blobName` text NOT NULL,
	`originalName` text NOT NULL,
	`createdBy` integer NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `fk_files_table_createdBy_users_table_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users_table`(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`externalId` text NOT NULL UNIQUE
);
