-- ============================================
-- MoReply Example Database Schema & Placeholder Data
-- ============================================
-- This file shows what the backend database might look like
-- The current project uses localStorage + JSON instead.
-- ============================================

-- 1️⃣ DATABASE SCHEMA
CREATE TABLE auto_reply_templates (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(20) NOT NULL,      -- Google, Yelp, Instagram, etc.
  tone VARCHAR(20) NOT NULL,          -- Friendly, Professional, etc.
  example_text TEXT NOT NULL,         -- what we are replying to
  reply_text TEXT NOT NULL,           -- the generated / hardcoded reply
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL
);

-- 2️⃣ PLACEHOLDER DATA 

INSERT INTO auto_reply_templates (
  id,
  name,
  platform,
  tone,
  example_text,
  reply_text,
  is_active,
  created_at
) VALUES
(
  'tpl_1730740000001',
  'Friendly Google reply',
  'Google',
  'Friendly',
  'The staff was super helpful and kind!',
  'Thank you so much for your message! We really appreciate your support and we’re so happy you had a great experience with us. 😊',
  TRUE,
  '2025-11-04T10:00:00Z'
),
(
  'tpl_1730740000002',
  'Apologetic Yelp reply',
  'Yelp',
  'Apologetic',
  'My order took too long to arrive.',
  'Thank you for letting us know about this. We’re really sorry for the inconvenience and we’re committed to making this right.',
  TRUE,
  '2025-11-04T10:05:00Z'
),
(
  'tpl_1730740000003',
  'Professional Facebook reply',
  'Facebook',
  'Professional',
  'Do you take reservations for large groups on weekends?',
  'Thank you for taking the time to share this. We value your feedback and will use it to keep improving our service.',
  TRUE,
  '2025-11-04T10:10:00Z'
),
(
  'tpl_1730740000004',
  'Playful Instagram reply',
  'Instagram',
  'Playful',
  'This place is my new favorite spot 😍',
  'You just made our day! 🎉 Thanks for the love — we can’t wait to see you again soon!',
  TRUE,
  '2025-11-04T10:15:00Z'
);

