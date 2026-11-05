"""
Forecast & Goal Service
Handles predictive savings projections and multi-month goal tracking.
Satisfies Success Criteria: 7, 10, 12.
"""

import calendar
from datetime import datetime

class ForecastService:
    def __init__(self, db_manager):
        self.db = db_manager

    def forecast_month_end(self, month_year, expected_income, as_of_date_str=None):
        """
        Estimates end-of-month savings using the Daily Burn Rate formula.
        Satisfies Criterion 7.
        """
        year, month = map(int, month_year.split("-"))
        total_days_in_month = calendar.monthrange(year, month)[1]

        # Determine evaluation day
        if as_of_date_str:
            eval_date = datetime.strptime(as_of_date_str, "%Y-%m-%d")
            eval_day = eval_date.day
        else:
            now = datetime.now()
            if now.year == year and now.month == month:
                eval_day = now.day
            else:
                eval_day = total_days_in_month  # Month completed

        eval_day = max(1, min(eval_day, total_days_in_month))

        # Query total expenses in this month up to evaluation day
        query = """
            SELECT COALESCE(SUM(t.amount), 0.0) AS total_expense
            FROM transactions t
            JOIN categories c ON t.category_id = c.category_id
            WHERE c.type = 'expense'
              AND strftime('%Y-%m', t.trans_date) = ?
              AND CAST(strftime('%d', t.trans_date) AS INTEGER) <= ?
        """
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, (month_year, eval_day))
            row = cursor.fetchone()
            total_spent_so_far = float(row["total_expense"]) if row else 0.0

        daily_burn_rate = total_spent_so_far / eval_day
        projected_total_expense = daily_burn_rate * total_days_in_month
        projected_savings = expected_income - projected_total_expense

        return {
            "eval_day": eval_day,
            "total_days_in_month": total_days_in_month,
            "days_remaining": total_days_in_month - eval_day,
            "spent_so_far": round(total_spent_so_far, 2),
            "daily_burn_rate": round(daily_burn_rate, 2),
            "projected_expense": round(projected_total_expense, 2),
            "projected_savings": round(projected_savings, 2)
        }

    def get_savings_goal_progress(self):
        """
        Computes progress toward the active savings goal based on lifetime net savings.
        Satisfies Criterion 12.
        """
        # Fetch active goal
        query_goal = "SELECT * FROM savings_goals WHERE is_active = 1 ORDER BY goal_id DESC LIMIT 1"
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query_goal)
            goal_row = cursor.fetchone()

            if not goal_row:
                return None

            goal = dict(goal_row)

            # Calculate lifetime income and expenses
            cursor.execute("""
                SELECT 
                    COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0.0) AS total_income,
                    COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0.0) AS total_expense
                FROM transactions t
                JOIN categories c ON t.category_id = c.category_id
            """)
            totals = cursor.fetchone()
            net_saved = float(totals["total_income"]) - float(totals["total_expense"])

        target = float(goal["target_amount"])
        # Protect against negative saved amount for progress bar
        effective_saved = max(0.0, net_saved)
        progress_pct = (effective_saved / target * 100.0) if target > 0 else 0.0
        remaining_needed = max(0.0, target - effective_saved)

        return {
            "goal_id": goal["goal_id"],
            "goal_name": goal["goal_name"],
            "target_amount": target,
            "target_date": goal["target_date"],
            "net_saved": round(net_saved, 2),
            "effective_saved": round(effective_saved, 2),
            "remaining_needed": round(remaining_needed, 2),
            "progress_percentage": min(100.0, round(progress_pct, 1)),
            "is_achieved": net_saved >= target
        }

    def set_savings_goal(self, name, target_amount, target_date):
        """Creates or replaces the active savings goal."""
        try:
            amt = float(target_amount)
        except (ValueError, TypeError):
            raise ValueError("Target amount must be a valid number.")

        if amt <= 0:
            raise ValueError("Target amount must be strictly greater than 0.")

        clean_name = name.strip()
        if not clean_name:
            raise ValueError("Goal name cannot be empty.")

        datetime.strptime(target_date.strip(), "%Y-%m-%d")

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            # Deactivate previous goals
            cursor.execute("UPDATE savings_goals SET is_active = 0 WHERE is_active = 1")
            cursor.execute(
                """
                INSERT INTO savings_goals (goal_name, target_amount, target_date, is_active)
                VALUES (?, ?, ?, 1)
                """,
                (clean_name, round(amt, 2), target_date.strip())
            )
            conn.commit()
