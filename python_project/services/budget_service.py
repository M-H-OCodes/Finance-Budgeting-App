"""
Budget Service
Manages monthly category spending ceilings, remaining balance tracking, 80% alerts,
and rule-based budget suggestions.
Satisfies Success Criteria: 3, 4, 6, 11.
"""

from config import SUGGESTED_RATIOS

class BudgetService:
    def __init__(self, db_manager):
        self.db = db_manager

    def set_budget(self, category_id, month_year, allocated_amount):
        """Sets or updates a budget ceiling for a specific category and month."""
        try:
            amt = float(allocated_amount)
        except (ValueError, TypeError):
            raise ValueError("Allocated budget must be a valid number.")

        if amt < 0:
            raise ValueError("Budget allocation cannot be negative.")

        if len(month_year) != 7 or month_year[4] != "-":
            raise ValueError("Month format must be YYYY-MM (e.g. 2026-10).")

        query = """
            INSERT INTO budgets (category_id, month_year, allocated_amount)
            VALUES (?, ?, ?)
            ON CONFLICT(category_id, month_year) 
            DO UPDATE SET allocated_amount = excluded.allocated_amount
        """
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (int(category_id), month_year, round(amt, 2)))
            conn.commit()

    def get_monthly_budget_status(self, month_year):
        """
        Calculates remaining budget and percentage spent for all expense categories in month_year.
        Satisfies Criterion 4.
        """
        query = """
            SELECT c.category_id, c.name AS category_name,
                   COALESCE(b.allocated_amount, 0.0) AS allocated_amount,
                   COALESCE(SUM(t.amount), 0.0) AS spent_amount
            FROM categories c
            LEFT JOIN budgets b ON c.category_id = b.category_id AND b.month_year = ?
            LEFT JOIN transactions t ON c.category_id = t.category_id 
                 AND strftime('%Y-%m', t.trans_date) = ?
            WHERE c.type = 'expense'
            GROUP BY c.category_id, c.name, b.allocated_amount
            ORDER BY c.name ASC
        """
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (month_year, month_year))
            rows = cursor.fetchall()

        results = []
        for r in rows:
            allocated = float(r["allocated_amount"])
            spent = float(r["spent_amount"])
            remaining = allocated - spent
            pct_used = (spent / allocated * 100.0) if allocated > 0 else (100.0 if spent > 0 else 0.0)

            results.append({
                "category_id": r["category_id"],
                "category_name": r["category_name"],
                "allocated": round(allocated, 2),
                "spent": round(spent, 2),
                "remaining": round(remaining, 2),
                "percentage_used": round(pct_used, 1)
            })
        return results

    def check_threshold_alerts(self, month_year):
        """
        Evaluates 80% and over-budget alerts (Criterion 6).
        Returns list of alert dictionaries with level ('WARNING' or 'DANGER').
        """
        budget_statuses = self.get_monthly_budget_status(month_year)
        alerts = []

        for item in budget_statuses:
            allocated = item["allocated"]
            spent = item["spent"]
            if allocated > 0:
                ratio = spent / allocated
                if ratio >= 1.0:
                    overage = spent - allocated
                    alerts.append({
                        "category": item["category_name"],
                        "level": "DANGER",
                        "message": f"Over budget by {overage:,.2f} PKR! ({item['percentage_used']}%)",
                        "percentage": item["percentage_used"]
                    })
                elif ratio >= 0.80:
                    remaining = allocated - spent
                    alerts.append({
                        "category": item["category_name"],
                        "level": "WARNING",
                        "message": f"80% threshold reached! Only {remaining:,.2f} PKR remaining ({item['percentage_used']}%).",
                        "percentage": item["percentage_used"]
                    })
        return alerts

    def suggest_budget_distribution(self, monthly_income, target_monthly_savings):
        """
        Suggests category allocations from disposable pool (Criterion 11).
        Formula: Pool = Income - Savings. Allocates based on standard student living weights.
        """
        try:
            inc = float(monthly_income)
            sav = float(target_monthly_savings)
        except (ValueError, TypeError):
            raise ValueError("Income and savings targets must be valid numbers.")

        if sav >= inc:
            raise ValueError("Target monthly savings must be strictly less than monthly income.")
        if sav < 0 or inc <= 0:
            raise ValueError("Amounts must be positive.")

        spending_pool = inc - sav
        suggested = {}
        allocated_running_sum = 0.0

        for cat_name, ratio in SUGGESTED_RATIOS.items():
            amount = round(spending_pool * ratio, 0)
            suggested[cat_name] = amount
            allocated_running_sum += amount

        # Compensate for rounding difference in the Miscellaneous category
        discrepancy = round(spending_pool - allocated_running_sum, 0)
        if "Miscellaneous" in suggested:
            suggested["Miscellaneous"] += discrepancy

        return {
            "spending_pool": spending_pool,
            "allocations": suggested
        }
