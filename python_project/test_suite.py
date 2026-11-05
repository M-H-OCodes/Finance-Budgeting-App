"""
Automated Test Suite for IB Computer Science SL Internal Assessment (Criterion E)
Executes all 20 Test Cases specified in Phase 5:
- Normal, Boundary, and Erroneous test types
- Validates data constraints, zero budgets, 80% boundary, burn rate formulas, and goals
"""

import unittest
import os
import sqlite3
from database.db_manager import DatabaseManager
from services.transaction_service import TransactionService
from services.budget_service import BudgetService
from services.forecast_service import ForecastService

class TestPersonalFinanceManager(unittest.TestCase):
    def setUp(self):
        # Use an isolated in-memory or temporary SQLite database for clean testing
        self.test_db_path = "test_finance.db"
        if os.path.exists(self.test_db_path):
            os.remove(self.test_db_path)

        self.db = DatabaseManager(db_path=self.test_db_path)
        self.trans_svc = TransactionService(self.db)
        self.budget_svc = BudgetService(self.db)
        self.forecast_svc = ForecastService(self.db)

        # Cache category map
        self.cats = {c["name"]: c["category_id"] for c in self.db.get_all_categories()}

    def tearDown(self):
        if os.path.exists(self.test_db_path):
            os.remove(self.test_db_path)

    # T1: Normal transaction recording
    def test_T1_record_normal_transaction(self):
        tid = self.trans_svc.validate_and_record_transaction(
            amount=450.0,
            trans_date="2026-10-20",
            description="Mess dinner coupon",
            category_id=self.cats["Food & Mess"]
        )
        self.assertIsNotNone(tid)
        recents = self.trans_svc.get_recent_transactions(limit=1)
        self.assertEqual(len(recents), 1)
        self.assertEqual(recents[0]["amount"], 450.0)

    # T2: Erroneous negative amount validation
    def test_T2_negative_amount_rejection(self):
        with self.assertRaises(ValueError) as ctx:
            self.trans_svc.validate_and_record_transaction(
                amount=-150.0,
                trans_date="2026-10-20",
                description="Invalid negative expense",
                category_id=self.cats["Food & Mess"]
            )
        self.assertIn("greater than 0", str(ctx.exception))

    # T3: Erroneous invalid date validation
    def test_T3_invalid_date_format(self):
        with self.assertRaises(ValueError) as ctx:
            self.trans_svc.validate_and_record_transaction(
                amount=200.0,
                trans_date="2026-13-45",
                description="Invalid date",
                category_id=self.cats["Food & Mess"]
            )
        self.assertIn("YYYY-MM-DD", str(ctx.exception))

    # T4: Custom category addition
    def test_T4_add_custom_category(self):
        cid = self.db.add_category("Clinical Equipment", "expense")
        self.assertIsNotNone(cid)
        cats = [c["name"] for c in self.db.get_all_categories(category_type="expense")]
        self.assertIn("Clinical Equipment", cats)

    # T5: Duplicate category rejection (Integrity check)
    def test_T5_duplicate_category_rejection(self):
        with self.assertRaises(ValueError) as ctx:
            self.db.add_category("Food & Mess", "expense")
        self.assertIn("already exists", str(ctx.exception))

    # T6: Normal budget setup
    def test_T6_budget_setup(self):
        self.budget_svc.set_budget(self.cats["Food & Mess"], "2026-10", 13600.0)
        statuses = self.budget_svc.get_monthly_budget_status("2026-10")
        food_status = next(s for s in statuses if s["category_name"] == "Food & Mess")
        self.assertEqual(food_status["allocated"], 13600.0)

    # T7: Boundary: Zero budget allocation
    def test_T7_zero_budget_allocation(self):
        self.budget_svc.set_budget(self.cats["Entertainment"], "2026-10", 0.0)
        statuses = self.budget_svc.get_monthly_budget_status("2026-10")
        ent_status = next(s for s in statuses if s["category_name"] == "Entertainment")
        self.assertEqual(ent_status["allocated"], 0.0)

    # T8: Normal remaining budget calculation
    def test_T8_remaining_budget_calculation(self):
        self.budget_svc.set_budget(self.cats["Transport / Fuel"], "2026-10", 5100.0)
        self.trans_svc.validate_and_record_transaction(4400.0, "2026-10-10", "Petrol", self.cats["Transport / Fuel"])
        statuses = self.budget_svc.get_monthly_budget_status("2026-10")
        t_status = next(s for s in statuses if s["category_name"] == "Transport / Fuel")
        self.assertEqual(t_status["remaining"], 700.0)
        self.assertEqual(t_status["percentage_used"], 86.3)

    # T9: Boundary: Exactly 80% alert threshold
    def test_T9_exact_80_percent_alert(self):
        self.budget_svc.set_budget(self.cats["Education & Books"], "2026-10", 10000.0)
        self.trans_svc.validate_and_record_transaction(8000.0, "2026-10-05", "Books", self.cats["Education & Books"])
        alerts = self.budget_svc.check_threshold_alerts("2026-10")
        edu_alerts = [a for a in alerts if a["category"] == "Education & Books"]
        self.assertEqual(len(edu_alerts), 1)
        self.assertEqual(edu_alerts[0]["level"], "WARNING")

    # T10: Boundary: 79.9% spent (no alert triggered)
    def test_T10_79_point_9_percent_no_alert(self):
        self.budget_svc.set_budget(self.cats["Education & Books"], "2026-10", 10000.0)
        self.trans_svc.validate_and_record_transaction(7990.0, "2026-10-05", "Books", self.cats["Education & Books"])
        alerts = self.budget_svc.check_threshold_alerts("2026-10")
        edu_alerts = [a for a in alerts if a["category"] == "Education & Books"]
        self.assertEqual(len(edu_alerts), 0)

    # T11: Boundary: Budget exceeded (DANGER alert)
    def test_T11_budget_exceeded_alert(self):
        self.budget_svc.set_budget(self.cats["Miscellaneous"], "2026-10", 1000.0)
        self.trans_svc.validate_and_record_transaction(1200.0, "2026-10-08", "Emergency repair", self.cats["Miscellaneous"])
        alerts = self.budget_svc.check_threshold_alerts("2026-10")
        misc_alerts = [a for a in alerts if a["category"] == "Miscellaneous"]
        self.assertEqual(len(misc_alerts), 1)
        self.assertEqual(misc_alerts[0]["level"], "DANGER")

    # T12: Normal month-end forecast
    def test_T12_forecast_calculation(self):
        # Record 21,000 spent by Oct 20
        self.trans_svc.validate_and_record_transaction(21000.0, "2026-10-20", "Mid-month bundle", self.cats["Food & Mess"])
        fc = self.forecast_svc.forecast_month_end("2026-10", expected_income=40000.0, as_of_date_str="2026-10-20")
        self.assertEqual(fc["daily_burn_rate"], 1050.0)
        self.assertEqual(fc["projected_expense"], 32550.0)
        self.assertEqual(fc["projected_savings"], 7450.0)

    # T13: Boundary: Forecast on Day 1 (no zero division)
    def test_T13_forecast_day_one_boundary(self):
        self.trans_svc.validate_and_record_transaction(500.0, "2026-10-01", "Day 1 snack", self.cats["Food & Mess"])
        fc = self.forecast_svc.forecast_month_end("2026-10", expected_income=40000.0, as_of_date_str="2026-10-01")
        self.assertEqual(fc["daily_burn_rate"], 500.0)
        self.assertEqual(fc["projected_expense"], 15500.0)
        self.assertEqual(fc["projected_savings"], 24500.0)

    # T14: Search filtering by keyword
    def test_T14_search_by_keyword(self):
        self.trans_svc.validate_and_record_transaction(500.0, "2026-10-10", "Hostel Mess tea", self.cats["Food & Mess"])
        self.trans_svc.validate_and_record_transaction(800.0, "2026-10-12", "Bike fuel", self.cats["Transport / Fuel"])
        results = self.trans_svc.search_transactions(keyword="Mess")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["description"], "Hostel Mess tea")

    # T15: Search with no match
    def test_T15_search_no_match(self):
        self.trans_svc.validate_and_record_transaction(500.0, "2026-10-10", "Hostel tea", self.cats["Food & Mess"])
        results = self.trans_svc.search_transactions(keyword="UnicornStethoscope")
        self.assertEqual(len(results), 0)

    # T16: Normal budget suggestion logic (Criterion 11)
    def test_T16_suggest_limits_distribution(self):
        res = self.budget_svc.suggest_budget_distribution(monthly_income=40000.0, target_monthly_savings=6000.0)
        self.assertEqual(res["spending_pool"], 34000.0)
        allocs = res["allocations"]
        self.assertEqual(allocs["Food & Mess"], 13600.0)
        self.assertEqual(allocs["Transport / Fuel"], 5100.0)
        self.assertEqual(allocs["Education & Books"], 5100.0)
        self.assertEqual(sum(allocs.values()), 34000.0)

    # T17: Erroneous budget suggestion: savings >= income
    def test_T17_suggest_limits_excessive_savings_rejected(self):
        with self.assertRaises(ValueError) as ctx:
            self.budget_svc.suggest_budget_distribution(monthly_income=40000.0, target_monthly_savings=45000.0)
        self.assertIn("strictly less than", str(ctx.exception))

    # T18: Normal savings goal progress
    def test_T18_savings_goal_progress(self):
        self.forecast_svc.set_savings_goal("Littmann Stethoscope", 25000.0, "2026-12-31")
        # Lifetime: Income 40,000, Expense 21,000 -> Net 19,000 (76.0%)
        self.trans_svc.validate_and_record_transaction(40000.0, "2026-10-01", "Stipend", self.cats["Monthly Stipend"])
        self.trans_svc.validate_and_record_transaction(21000.0, "2026-10-20", "Expenses", self.cats["Food & Mess"])
        progress = self.forecast_svc.get_savings_goal_progress()
        self.assertEqual(progress["net_saved"], 19000.0)
        self.assertEqual(progress["remaining_needed"], 6000.0)
        self.assertEqual(progress["progress_percentage"], 76.0)
        self.assertFalse(progress["is_achieved"])

    # T19: Boundary: Negative net savings clamped to 0% progress
    def test_T19_negative_net_savings_clamping(self):
        self.forecast_svc.set_savings_goal("Emergency Fund", 20000.0, "2026-12-31")
        self.trans_svc.validate_and_record_transaction(10000.0, "2026-10-01", "Income", self.cats["Monthly Stipend"])
        self.trans_svc.validate_and_record_transaction(15000.0, "2026-10-05", "Big bill", self.cats["Food & Mess"])
        progress = self.forecast_svc.get_savings_goal_progress()
        self.assertEqual(progress["net_saved"], -5000.0)
        self.assertEqual(progress["progress_percentage"], 0.0)

    # T20: Persistence across database reconnections
    def test_T20_persistence_verification(self):
        self.trans_svc.validate_and_record_transaction(1500.0, "2026-10-15", "Lab kit", self.cats["Education & Books"])
        # Re-instantiate database manager with the same file
        new_db = DatabaseManager(db_path=self.test_db_path)
        new_trans_svc = TransactionService(new_db)
        recents = new_trans_svc.get_recent_transactions(limit=5)
        self.assertTrue(any(r["description"] == "Lab kit" for r in recents))

if __name__ == "__main__":
    unittest.main()
