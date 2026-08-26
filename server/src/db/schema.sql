-- ============================================================
-- Personal Task Manager — Database Schema (PostgreSQL)
-- ============================================================

-- جدول المستخدمين
CREATE TABLE users (
  id                SERIAL       PRIMARY KEY,
  name              VARCHAR(50)  NOT NULL,
  email             VARCHAR(255) UNIQUE NOT NULL,
  password          VARCHAR(255) NOT NULL,          -- bcrypt hash
  is_verified       BOOLEAN      NOT NULL DEFAULT FALSE,
  verification_code VARCHAR(6),                    
  code_expires_at   TIMESTAMPTZ,                   
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- جدول الفئات
CREATE TABLE categories (
  id          SERIAL      PRIMARY KEY,
  name        VARCHAR(20) NOT NULL,
  color       VARCHAR(20) NOT NULL,                 
  is_system   BOOLEAN     NOT NULL DEFAULT FALSE,   
  user_id     INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name)                            
);

-- جدول المهام
CREATE TABLE tasks (
  id            SERIAL       PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  due_date      DATE,
  due_time      TIME,
  priority      VARCHAR(12)  CHECK (priority IN ('urgent', 'medium', 'not_urgent')),
  is_completed  BOOLEAN      NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,                          
  reminder_at   TIMESTAMPTZ,                          
  reminder_sent BOOLEAN      NOT NULL DEFAULT FALSE,
  category_id   INTEGER      REFERENCES categories(id) ON DELETE SET NULL,
  user_id       INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);