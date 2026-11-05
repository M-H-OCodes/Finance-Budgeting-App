"""
Transaction Service
Handles business logic, validation, and querying for financial transactions.
Satisfies Success Criteria: 1, 8, 9.
"""

from datetime import datetime
import csv

class TransactionService:
    def __init__(self, db_manager):
        self.db = db_manager

    def validate_and_record_transaction(self, amount, trans_date, description, category_id):
        """
        Validates input fields and saves a transaction to the database.
        Returns the inserted transaction_id.
        """
        # 1. Validate Amount
        try:
            val_amount = float(amount)
        except (ValueError, TypeError):
            raise ValueError("Amount must be a valid numeric value.")
        if val_amount <= 0:
            raise ValueError("Transaction amount must be strictly greater than 0.")

        # 2. Validate Date Format (YYYY-MM-DD)
        try:
            parsed_date = datetime.strptime(trans_date.strip(), "%Y-%m-%d")
            clean_date = parsed_date.strftime("%Y-%m-%d")
        except ValueError:
            raise ValueError("Date must be in valid YYYY-MM-DD format.")

        # 3. Validate Description
        clean_desc = description.strip()
        if not clean_desc:
            raise ValueError("Description cannot be empty.")

        # 4. Validate Category ID
        try:
            val_cat_id = int(category_id)
        except (ValueError, TypeError):
            raise ValueError("Invalid category selected.")

        # Insert into database
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO transactions (amount, trans_date, description, category_id)
                VALUES (?, ?, ?, ?)
                """,
                (round(val_amount, 2), clean_date, clean_desc, val_cat_id)
            )
            conn.commit()
            return cursor.lastrowid

    def get_recent_transactions(self, limit=10):
        """Fetches the most recent transactions with joined category details."""
        query = """
            SELECT t.transaction_id, t.amount, t.trans_date, t.description, 
                   c.category_id, c.name AS category_name, c.type AS category_type
            FROM transactions t
            JOIN categories c ON t.category_id = c.category_id
            ORDER BY t.trans_date DESC, t.transaction_id DESC
            LIMIT ?
        """
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (limit,))
            return [dict(row) for row in cursor.fetchall()]

    def search_transactions(self, keyword=None, category_id=None, start_date=None, end_date=None):
        """
        Searches transactions with dynamic parameter filtering (Criterion 9).
        Safely builds parameterized queries to prevent SQL injection.
        """
        query = """
            SELECT t.transaction_id, t.amount, t.trans_date, t.description,
                   c.name AS category_name, c.type AS category_type
            FROM transactions t
            JOIN categories c ON t.category_id = c.category_id
            WHERE 1=1
        """
        params = []

        if keyword and keyword.strip():
            query += " AND t.description LIKE ?"
            params.append(f"%{keyword.strip()}%")

        if category_id and str(category_id) != "ALL":
            query += " AND t.category_id = ?"
            params.append(int(category_id))

        if start_date and start_date.strip():
            query += " AND t.trans_date >= ?"
            params.append(start_date.strip())

        if end_date and end_date.strip():
            query += " AND t.trans_date <= ?"
            params.append(end_date.strip())

        query += " ORDER BY t.trans_date DESC, t.transaction_id DESC"

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, tuple(params))
            return [dict(row) for row in cursor.fetchall()]

    def delete_transaction(self, transaction_id):
        """Deletes a specific transaction by ID."""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM transactions WHERE transaction_id = ?", (transaction_id,))
            conn.commit()
            return cursor.rowcount > 0

    def export_to_csv(self, file_path, transactions_list):
        """Exports a list of transaction dictionaries to a CSV file."""
        if not transactions_list:
            raise ValueError("No transaction records available to export.")

        fieldnames = ["transaction_id", "trans_date", "category_type", "category_name", "description", "amount"]
        with open(file_path, "w", newline="", encoding="utf-8") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for row in transactions_list:
                writer.writerow({
                    "transaction_id": row.get("transaction_id"),
                    "trans_date": row.get("trans_date"),
                    "category_type": row.get("category_type"),
                    "category_name": row.get("category_name"),
                    "description": row.get("description"),
                    "amount": row.get("amount")
                })
