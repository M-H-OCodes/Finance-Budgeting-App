"""
Main Entry Point
Personal Finance Manager (Hostel Medical Student Edition)
IB DP Computer Science SL Internal Assessment Product
Tech Stack: Python + SQLite + Tkinter + Matplotlib
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.db_manager import DatabaseManager
from services.transaction_service import TransactionService
from services.budget_service import BudgetService
from services.forecast_service import ForecastService

def seed_sample_data_if_empty(db_manager, trans_service, budget_service, forecast_service):
    """
    Seeds initial realistic data matching the client's scenario (40,000 PKR monthly stipend,
    hostel food, transport, books, and savings goal) so the user can immediately evaluate
    the working system.
    """
    with db_manager.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) AS count FROM transactions")
        count = cursor.fetchone()["count"]

    if count == 0:
        print("[System] Seeding realistic scenario for hostel medical student (40,000 PKR)...")
        # 1. Active Savings Goal (Littmann Stethoscope 25,000 PKR)
        forecast_service.set_savings_goal(
            name="Littmann Classic III Stethoscope",
            target_amount=25000.0,
            target_date="2026-12-31"
        )

        # 2. Get Category IDs
        cats = {c["name"]: c["category_id"] for c in db_manager.get_all_categories()}

        # 3. Monthly Budget Setup for current month (Oct 2026)
        current_month = "2026-10"
        budget_service.set_budget(cats["Food & Mess"], current_month, 13600.0)
        budget_service.set_budget(cats["Transport / Fuel"], current_month, 5100.0)
        budget_service.set_budget(cats["Education & Books"], current_month, 5100.0)
        budget_service.set_budget(cats["Personal Care & Laundry"], current_month, 5100.0)
        budget_service.set_budget(cats["Miscellaneous"], current_month, 5100.0)

        # 4. Income Record (Stipend 40,000 PKR)
        trans_service.validate_and_record_transaction(
            amount=40000.0,
            trans_date="2026-10-01",
            description="Monthly stipend deposit from hospital / family",
            category_id=cats["Monthly Stipend"]
        )

        # 5. Recorded Expenses (Matching the worked numeric trace from Phase 2)
        trans_service.validate_and_record_transaction(6000.0, "2026-10-02", "Hostel Mess Advance monthly coupon", cats["Food & Mess"])
        trans_service.validate_and_record_transaction(3200.0, "2026-10-10", "Weekly grocery & hostel snacks", cats["Food & Mess"])
        trans_service.validate_and_record_transaction(2000.0, "2026-10-18", "Cafeteria meals with study group", cats["Food & Mess"])

        trans_service.validate_and_record_transaction(2200.0, "2026-10-05", "Motorcycle petrol tank full", cats["Transport / Fuel"])
        trans_service.validate_and_record_transaction(2200.0, "2026-10-16", "Motorcycle petrol refuel", cats["Transport / Fuel"])

        trans_service.validate_and_record_transaction(1800.0, "2026-10-07", "Robbins Basic Pathology review guide", cats["Education & Books"])
        trans_service.validate_and_record_transaction(700.0, "2026-10-14", "Anatomy lab dissection gloves & notebook", cats["Education & Books"])

        trans_service.validate_and_record_transaction(1200.0, "2026-10-04", "Hostel laundry bundle monthly service", cats["Personal Care & Laundry"])
        trans_service.validate_and_record_transaction(600.0, "2026-10-12", "Toiletries & soap", cats["Personal Care & Laundry"])

        trans_service.validate_and_record_transaction(1100.0, "2026-10-15", "Room shared electricity unit contribution", cats["Miscellaneous"])
        print("[System] Seeding complete.")

def run_cli_demo(db_mgr, trans_svc, budget_svc, forecast_svc):
    """Fallback interactive CLI console if running in a headless environment without X11/Tkinter."""
    print("=" * 65)
    print("PERSONAL FINANCE MANAGER - STUDENT HOSTEL EDITION (CLI DEMO)")
    print("Client: Medical Student | Monthly Stipend: 40,000 PKR")
    print("=" * 65)
    month = "2026-10"
    statuses = budget_svc.get_monthly_budget_status(month)
    total_spent = sum(s["spent"] for s in statuses)
    total_budget = sum(s["allocated"] for s in statuses)
    forecast = forecast_svc.forecast_month_end(month, 40000.0, "2026-10-20")
    goal = forecast_svc.get_savings_goal_progress()

    print(f"\n[DASHBOARD: {month}]")
    print(f"Total Budgeted:   PKR {total_budget:,.2f}")
    print(f"Total Spent:      PKR {total_spent:,.2f}")
    print(f"Remaining Budget: PKR {total_budget - total_spent:,.2f}")
    print(f"Daily Burn Rate:  PKR {forecast['daily_burn_rate']:,.2f} / day")
    print(f"Projected Savings:PKR {forecast['projected_savings']:,.2f} by month-end")

    alerts = budget_svc.check_threshold_alerts(month)
    if alerts:
        print("\n[ACTIVE ALERTS (Criterion 6)]")
        for a in alerts:
            print(f"  * {a['level']}: [{a['category']}] {a['message']}")

    print("\n[CATEGORY BUDGET STATUS (Criterion 4)]")
    for s in statuses:
        print(f"  {s['category_name']:<25} Budget: {s['allocated']:>8,.0f} | Spent: {s['spent']:>8,.0f} | Left: {s['remaining']:>8,.0f} | Used: {s['percentage_used']:>5.1f}%")

    if goal:
        print("\n[SAVINGS GOAL TRACKER (Criterion 12)]")
        print(f"  Goal: {goal['goal_name']}")
        print(f"  Target: PKR {goal['target_amount']:,.2f} | Deadline: {goal['target_date']}")
        print(f"  Net Saved: PKR {goal['net_saved']:,.2f} ({goal['progress_percentage']:.1f}% Achieved)")
        print(f"  Remaining Needed: PKR {goal['remaining_needed']:,.2f}")

    print("=" * 65)

def main():
    db_mgr = DatabaseManager()
    trans_svc = TransactionService(db_mgr)
    budget_svc = BudgetService(db_mgr)
    forecast_svc = ForecastService(db_mgr)

    seed_sample_data_if_empty(db_mgr, trans_svc, budget_svc, forecast_svc)

    try:
        from views.main_window import MainWindow
        app = MainWindow(
            db_manager=db_mgr,
            trans_service=trans_svc,
            budget_service=budget_svc,
            forecast_service=forecast_svc
        )
        print("[System] Launching Tkinter desktop graphical interface...")
        app.mainloop()
    except Exception as e:
        print(f"\n[Note] Desktop GUI display unavailable ({e}).")
        print("[Note] Running demonstration via console mode:\n")
        run_cli_demo(db_mgr, trans_svc, budget_svc, forecast_svc)

if __name__ == "__main__":
    main()
