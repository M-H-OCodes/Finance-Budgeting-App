"""
Database Access Layer (DAO) for Personal Finance Manager
Handles SQLite connection, table initialization, and seeding.
"""

import os
import sqlite3
from config import PREDEFINED_CATEGORIES

class DatabaseManager:
    def __init__(self, db_path=None):
        if db_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            self.db_path = os.path.join(base_dir, "finance.db")
        else:
            self.db_path = db_path
        self._init_db()

    def get_connection(self):
        """Returns a SQLite connection with foreign keys enabled and Row factory."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def _init_db(self):
        """Initializes tables from schema.sql and seeds predefined categories."""
        schema_file = os.path.join(os.path.dirname(__file__), "schema.sql")
        with open(schema_file, "r", encoding="utf-8") as f:
            ddl_script = f.read()

        with self.get_connection() as conn:
            conn.executescript(ddl_script)
            cursor = conn.cursor()

            # Seed predefined categories if they don't exist
            for cat_name, cat_type in PREDEFINED_CATEGORIES:
                cursor.execute(
                    """
                    INSERT OR IGNORE INTO categories (name, type, is_predefined)
                    VALUES (?, ?, 1)
                    """,
                    (cat_name, cat_type)
                )
            conn.commit()

    def get_all_categories(self, category_type=None):
        """Retrieves categories, optionally filtered by type ('income' or 'expense')."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            if category_type:
                cursor.execute(
                    "SELECT * FROM categories WHERE type = ? ORDER BY name ASC",
                    (category_type,)
                )
            else:
                cursor.execute("SELECT * FROM categories ORDER BY type ASC, name ASC")
            return [dict(row) for row in cursor.fetchall()]

    def add_category(self, name, category_type):
        """Adds a new custom category. Raises ValueError if duplicate."""
        cleaned_name = name.strip()
        if not cleaned_name:
            raise ValueError("Category name cannot be empty.")
        if category_type not in ('income', 'expense'):
            raise ValueError("Category type must be 'income' or 'expense'.")

        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO categories (name, type, is_predefined) VALUES (?, ?, 0)",
                    (cleaned_name, category_type)
                )
                conn.commit()
                return cursor.lastrowid
        except sqlite3.IntegrityError:
            raise ValueError(f"Category '{cleaned_name}' already exists.")
