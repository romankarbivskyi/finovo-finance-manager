CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(50) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "email" VARCHAR(100) NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "goals" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "target_date" DATE,
  "current_amount" DECIMAL(10, 2) DEFAULT 0.00,
  "target_amount" DECIMAL(10, 2) NOT NULL,
  "currency" VARCHAR(10) NOT NULL CHECK (currency IN ('USD', 'UAH', 'EUR')) DEFAULT 'UAH',
  "preview_image" VARCHAR(255),
  "status" VARCHAR(20) NOT NULL CHECK (status IN ('active', 'completed')) DEFAULT 'active',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "transactions" (
  "id" SERIAL PRIMARY KEY,
  "goal_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "amount" DECIMAL(10, 2) NOT NULL,
  "currency" VARCHAR(10) NOT NULL CHECK (currency IN ('USD', 'UAH', 'EUR')) DEFAULT 'UAH',
  "description" TEXT,
  "transaction_type" VARCHAR(12) NOT NULL CHECK (transaction_type IN ('contribution', 'withdrawal')),
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "password_resets" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "token" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);