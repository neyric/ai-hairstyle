ALTER TABLE `user_signin_logs` RENAME TO `signin_logs`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_signin_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session` text,
	`user_id` integer NOT NULL,
	`type` text NOT NULL,
	`ip` text,
	`user_agent` text,
	`headers` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_signin_logs`("id", "session", "user_id", "type", "ip", "user_agent", "headers", "created_at") SELECT "id", "session", "user_id", "type", "ip", "user_agent", "headers", "created_at" FROM `signin_logs`;--> statement-breakpoint
DROP TABLE `signin_logs`;--> statement-breakpoint
ALTER TABLE `__new_signin_logs` RENAME TO `signin_logs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;