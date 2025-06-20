CREATE TABLE `ai_tasks` (
	`task_no` text PRIMARY KEY NOT NULL,
	`user_id` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
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
