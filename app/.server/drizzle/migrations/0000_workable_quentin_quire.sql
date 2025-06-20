CREATE TABLE `credit_consumptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`credits` integer NOT NULL,
	`credit_record_id` integer NOT NULL,
	`source_type` text,
	`source_id` text,
	`reason` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`credit_record_id`) REFERENCES `credit_records`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `credit_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`credits` integer NOT NULL,
	`remaining_credits` integer NOT NULL,
	`trans_type` text NOT NULL,
	`source_type` text,
	`source_id` text,
	`expired_at` integer,
	`note` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_no` text NOT NULL,
	`order_detail` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`user_id` integer NOT NULL,
	`product_id` text NOT NULL,
	`product_name` text NOT NULL,
	`amount` integer NOT NULL,
	`status` text NOT NULL,
	`pay_session_id` text,
	`pay_provider` text DEFAULT 'creem',
	`session_detail` text,
	`paid_at` integer,
	`paid_email` text,
	`paid_detail` text,
	`is_error` integer,
	`error_msg` text,
	`sub_id` text,
	`subscription_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_no_unique` ON `orders` (`order_no`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_pay_session_id_unique` ON `orders` (`pay_session_id`);--> statement-breakpoint
CREATE TABLE `user_signin_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session` text,
	`user_id` integer NOT NULL,
	`type` text NOT NULL,
	`ip` text,
	`user_agent` text,
	`headers` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`plan_type` text NOT NULL,
	`status` text NOT NULL,
	`interval` text DEFAULT 'month',
	`interval_count` integer DEFAULT 1,
	`platform_sub_id` text,
	`start_at` integer DEFAULT (strftime('%s', 'now')),
	`expired_at` integer,
	`last_payment_at` integer,
	`cancel_at` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_auth` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`provider` text NOT NULL,
	`openid` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text,
	`nickname` text NOT NULL,
	`avatar_url` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `email_unique_idx` ON `users` (`email`);