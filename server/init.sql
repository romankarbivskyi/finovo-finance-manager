CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(50) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "email" VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS "goals" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "target_date" DATE,
  "current_amount" DECIMAL(10, 2) DEFAULT 0.00,
  "target_amount" DECIMAL(10, 2) NOT NULL,
  "currency" VARCHAR(10) NOT NULL CHECK (currency IN ('USH', 'UAH', 'EUR')) DEFAULT 'UAH',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "preview_image" VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);