-- ============================================================================
-- LLT-Management Admin PWA Push Subscriptions & Notification Logs Schema
-- Run this SQL in your Supabase SQL Editor
-- ============================================================================

-- 1. Table to store Web Push subscriptions for iOS & Android admin devices
CREATE TABLE IF NOT EXISTS public.admin_push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text UNIQUE NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  device_label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Table to log & deduplicate automated reminders and instant notifications
CREATE TABLE IF NOT EXISTS public.admin_notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_key text UNIQUE NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  url text NOT NULL DEFAULT '/admin/dashboard',
  booking_id text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for fast reminder lookups & recent feed queries
CREATE INDEX IF NOT EXISTS idx_admin_notification_logs_created_at
  ON public.admin_notification_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_notification_logs_key
  ON public.admin_notification_logs (notification_key);

-- Enable Row Level Security (with full access for authenticated admins & service role)
ALTER TABLE public.admin_push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notification_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on admin_push_subscriptions" ON public.admin_push_subscriptions;
CREATE POLICY "Allow all operations on admin_push_subscriptions"
  ON public.admin_push_subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on admin_notification_logs" ON public.admin_notification_logs;
CREATE POLICY "Allow all operations on admin_notification_logs"
  ON public.admin_notification_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

