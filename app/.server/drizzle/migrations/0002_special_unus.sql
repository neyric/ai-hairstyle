PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ai_tasks` (
	`task_no` text PRIMARY KEY NOT NULL,
	`user_id` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`input_params` text NOT NULL,
	`estimated_start_at` integer NOT NULL,
	`started_at` integer,
	`completed_at` integer,
	`aspect` text DEFAULT '1:1',
	`result_url` text,
	`fail_reason` text,
	`provider` text,
	`task_id` text,
	`request_param` text,
	`result_data` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_ai_tasks`("task_no", "user_id", "created_at", "status", "input_params", "estimated_start_at", "started_at", "completed_at", "aspect", "result_url", "fail_reason", "provider", "task_id", "request_param", "result_data") SELECT "task_no", "user_id", "created_at", "status", "input_params", "estimated_start_at", "started_at", "completed_at", "aspect", "result_url", "fail_reason", "provider", "task_id", "request_param", "result_data" FROM `ai_tasks`;--> statement-breakpoint
DROP TABLE `ai_tasks`;--> statement-breakpoint
ALTER TABLE `__new_ai_tasks` RENAME TO `ai_tasks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_credit_consumptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`credits` integer NOT NULL,
	`credit_record_id` integer NOT NULL,
	`source_type` text,
	`source_id` text,
	`reason` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`credit_record_id`) REFERENCES `credit_records`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_credit_consumptions`("id", "user_id", "credits", "credit_record_id", "source_type", "source_id", "reason", "created_at") SELECT "id", "user_id", "credits", "credit_record_id", "source_type", "source_id", "reason", "created_at" FROM `credit_consumptions`;--> statement-breakpoint
DROP TABLE `credit_consumptions`;--> statement-breakpoint
ALTER TABLE `__new_credit_consumptions` RENAME TO `credit_consumptions`;--> statement-breakpoint
CREATE TABLE `__new_credit_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`credits` integer NOT NULL,
	`remaining_credits` integer NOT NULL,
	`trans_type` text NOT NULL,
	`source_type` text,
	`source_id` text,
	`expired_at` integer,
	`note` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_credit_records`("id", "user_id", "credits", "remaining_credits", "trans_type", "source_type", "source_id", "expired_at", "note", "created_at", "updated_at") SELECT "id", "user_id", "credits", "remaining_credits", "trans_type", "source_type", "source_id", "expired_at", "note", "created_at", "updated_at" FROM `credit_records`;--> statement-breakpoint
DROP TABLE `credit_records`;--> statement-breakpoint
ALTER TABLE `__new_credit_records` RENAME TO `credit_records`;--> statement-breakpoint
CREATE TABLE `__new_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_no` text NOT NULL,
	`order_detail` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
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
INSERT INTO `__new_orders`("id", "order_no", "order_detail", "created_at", "user_id", "product_id", "product_name", "amount", "status", "pay_session_id", "pay_provider", "session_detail", "paid_at", "paid_email", "paid_detail", "is_error", "error_msg", "sub_id", "subscription_id") SELECT "id", "order_no", "order_detail", "created_at", "user_id", "product_id", "product_name", "amount", "status", "pay_session_id", "pay_provider", "session_detail", "paid_at", "paid_email", "paid_detail", "is_error", "error_msg", "sub_id", "subscription_id" FROM `orders`;--> statement-breakpoint
DROP TABLE `orders`;--> statement-breakpoint
ALTER TABLE `__new_orders` RENAME TO `orders`;--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_no_unique` ON `orders` (`order_no`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_pay_session_id_unique` ON `orders` (`pay_session_id`);--> statement-breakpoint
CREATE TABLE `__new_user_signin_logs` (
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
INSERT INTO `__new_user_signin_logs`("id", "session", "user_id", "type", "ip", "user_agent", "headers", "created_at") SELECT "id", "session", "user_id", "type", "ip", "user_agent", "headers", "created_at" FROM `user_signin_logs`;--> statement-breakpoint
DROP TABLE `user_signin_logs`;--> statement-breakpoint
ALTER TABLE `__new_user_signin_logs` RENAME TO `user_signin_logs`;--> statement-breakpoint
CREATE TABLE `__new_subscriptions` (
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
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_subscriptions`("id", "user_id", "plan_type", "status", "interval", "interval_count", "platform_sub_id", "start_at", "expired_at", "last_payment_at", "cancel_at", "created_at") SELECT "id", "user_id", "plan_type", "status", "interval", "interval_count", "platform_sub_id", "start_at", "expired_at", "last_payment_at", "cancel_at", "created_at" FROM `subscriptions`;--> statement-breakpoint
DROP TABLE `subscriptions`;--> statement-breakpoint
ALTER TABLE `__new_subscriptions` RENAME TO `subscriptions`;--> statement-breakpoint
CREATE TABLE `__new_user_auth` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`provider` text NOT NULL,
	`openid` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_auth`("id", "user_id", "provider", "openid", "created_at") SELECT "id", "user_id", "provider", "openid", "created_at" FROM `user_auth`;--> statement-breakpoint
DROP TABLE `user_auth`;--> statement-breakpoint
ALTER TABLE `__new_user_auth` RENAME TO `user_auth`;