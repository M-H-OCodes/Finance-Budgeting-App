-- Database schema DDL for Personal Finance Manager
-- Target: SQLite3

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    is_predefined INTEGER NOT NULL DEFAULT 0 CHECK(is_predefined IN (0, 1))
);

-- Budgets Table (Monthly category limit)
CREATE TABLE IF NOT EXISTS budgets (
    budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    month_year TEXT NOT NULL CHECK(length(month_year) = 7), -- 'YYYY-MM'
    allocated_amount REAL NOT NULL CHECK(allocated_amount >= 0),
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    UNIQUE(category_id, month_year)
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL CHECK(amount > 0),
    trans_date TEXT NOT NULL, -- 'YYYY-MM-DD'
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);

-- Savings Goals Table
CREATE TABLE IF NOT EXISTS savings_goals (
    goal_id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_name TEXT NOT NULL,
    target_amount REAL NOT NULL CHECK(target_amount > 0),
    target_date TEXT NOT NULL, -- 'YYYY-MM-DD'
    is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1))
);
