"""
Dashboard View (Modern Dark Slate Edition)
Presents executive financial indicators: Total spend, remaining budget, predicted savings,
threshold alert banners, and budget status table.
"""

import tkinter as tk
from tkinter import ttk
from datetime import datetime
from config import COLORS, CURRENCY_SYMBOL, DEFAULT_MONTHLY_STIPEND

class DashboardView(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=COLORS["bg_main"])
        self.controller = controller
        self.current_month = datetime.now().strftime("%Y-%m")
        self._build_ui()

    def _build_ui(self):
        # Header
        header_frame = tk.Frame(self, bg=COLORS["bg_main"], pady=16, padx=24)
        header_frame.pack(fill="x")

        lbl_title = tk.Label(
            header_frame,
            text=f"Financial Overview • {self.current_month}",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["bg_main"]
        )
        lbl_title.pack(side="left")

        btn_refresh = tk.Button(
            header_frame,
            text="↻ Refresh Data",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
            bg="#1E293B",
            fg="#38BDF8",
            activebackground="#0284C7",
            activeforeground="#FFFFFF",
            bd=0,
            padx=14,
            pady=6,
            cursor="hand2",
            command=self.refresh_data
        )
        btn_refresh.pack(side="right")

        # Top 4 KPI Cards Container
        cards_frame = tk.Frame(self, bg=COLORS["bg_main"], padx=24)
        cards_frame.pack(fill="x", pady=4)
        for i in range(4):
            cards_frame.columnconfigure(i, weight=1)

        self.card_stipend = self._create_card(cards_frame, 0, "MONTHLY STIPEND", f"{DEFAULT_MONTHLY_STIPEND:,.0f} {CURRENCY_SYMBOL}", "#38BDF8")
        self.card_spent = self._create_card(cards_frame, 1, "TOTAL SPENT (OCT)", "0.00 PKR", COLORS["text_bright"])
        self.card_remaining = self._create_card(cards_frame, 2, "REMAINING BUDGET", "0.00 PKR", "#2DD4BF")
        self.card_forecast = self._create_card(cards_frame, 3, "PRED. SAVINGS", "0.00 PKR", "#34D399")

        # Alert Banner Frame
        self.alert_frame = tk.Frame(self, bg=COLORS["bg_main"], padx=24)
        self.alert_frame.pack(fill="x", pady=(12, 0))

        # Split Layout: Budget Consumption + Recent Transactions
        split_frame = tk.Frame(self, bg=COLORS["bg_main"], padx=24, pady=12)
        split_frame.pack(fill="both", expand=True)
        split_frame.columnconfigure(0, weight=3)
        split_frame.columnconfigure(1, weight=2)
        split_frame.rowconfigure(0, weight=1)

        # Left Column: Category Budget Health
        budget_panel = tk.Frame(split_frame, bg=COLORS["card_bg"], padx=14, pady=14)
        budget_panel.grid(row=0, column=0, sticky="nsew", padx=(0, 10))

        tk.Label(
            budget_panel,
            text="Category Budget Consumption (Criterion 4)",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 11, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["card_bg"]
        ).pack(anchor="w", pady=(0, 10))

        cols = ("category", "budget", "spent", "remaining", "pct")
        self.budget_tree = ttk.Treeview(budget_panel, columns=cols, show="headings", height=8)
        self.budget_tree.heading("category", text="Category")
        self.budget_tree.heading("budget", text="Limit (PKR)")
        self.budget_tree.heading("spent", text="Spent (PKR)")
        self.budget_tree.heading("remaining", text="Remaining")
        self.budget_tree.heading("pct", text="Used %")

        self.budget_tree.column("category", width=140, anchor="w")
        self.budget_tree.column("budget", width=85, anchor="e")
        self.budget_tree.column("spent", width=85, anchor="e")
        self.budget_tree.column("remaining", width=85, anchor="e")
        self.budget_tree.column("pct", width=65, anchor="center")

        self.budget_tree.pack(side="left", fill="both", expand=True)

        # Right Column: Recent Transactions
        recents_panel = tk.Frame(split_frame, bg=COLORS["card_bg"], padx=14, pady=14)
        recents_panel.grid(row=0, column=1, sticky="nsew")

        tk.Label(
            recents_panel,
            text="Recent Activity Log",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 11, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["card_bg"]
        ).pack(anchor="w", pady=(0, 10))

        r_cols = ("date", "category", "amount")
        self.recent_tree = ttk.Treeview(recents_panel, columns=r_cols, show="headings", height=8)
        self.recent_tree.heading("date", text="Date")
        self.recent_tree.heading("category", text="Category")
        self.recent_tree.heading("amount", text="Amount")

        self.recent_tree.column("date", width=85, anchor="center")
        self.recent_tree.column("category", width=110, anchor="w")
        self.recent_tree.column("amount", width=80, anchor="e")

        self.recent_tree.pack(side="left", fill="both", expand=True)

    def _create_card(self, parent, col, title, value, color):
        frame = tk.Frame(parent, bg=COLORS["card_bg"], padx=16, pady=14)
        frame.grid(row=0, column=col, padx=5, sticky="ew")

        lbl_t = tk.Label(
            frame,
            text=title,
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 8, "bold"),
            fg=COLORS["text_muted"],
            bg=COLORS["card_bg"]
        )
        lbl_t.pack(anchor="w")

        lbl_v = tk.Label(
            frame,
            text=value,
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 15, "bold"),
            fg=color,
            bg=COLORS["card_bg"]
        )
        lbl_v.pack(anchor="w", pady=(4, 0))
        return lbl_v

    def refresh_data(self):
        statuses = self.controller.budget_service.get_monthly_budget_status(self.current_month)
        total_allocated = sum(s["allocated"] for s in statuses)
        total_spent = sum(s["spent"] for s in statuses)
        net_remaining = total_allocated - total_spent

        forecast = self.controller.forecast_service.forecast_month_end(self.current_month, DEFAULT_MONTHLY_STIPEND)

        self.card_spent.config(text=f"{total_spent:,.2f} {CURRENCY_SYMBOL}")
        self.card_remaining.config(
            text=f"{net_remaining:,.2f} {CURRENCY_SYMBOL}",
            fg="#2DD4BF" if net_remaining >= 0 else COLORS["danger"]
        )
        self.card_forecast.config(
            text=f"{forecast['projected_savings']:,.2f} {CURRENCY_SYMBOL}",
            fg="#34D399" if forecast["projected_savings"] >= 0 else COLORS["danger"]
        )

        # Alerts
        alerts = self.controller.budget_service.check_threshold_alerts(self.current_month)
        for w in self.alert_frame.winfo_children():
            w.destroy()

        if alerts:
            for alert in alerts:
                bg_col = COLORS["danger_bg"] if alert["level"] == "DANGER" else COLORS["warning_bg"]
                fg_col = "#FDA4AF" if alert["level"] == "DANGER" else "#FDE68A"
                icon = "🚨 OVER BUDGET" if alert["level"] == "DANGER" else "⚠️ 80% THRESHOLD WARNING"

                lbl = tk.Label(
                    self.alert_frame,
                    text=f"  {icon}: [{alert['category']}] {alert['message']}",
                    font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
                    fg=fg_col,
                    bg=bg_col,
                    padx=14,
                    pady=8,
                    anchor="w"
                )
                lbl.pack(fill="x", pady=2)

        # Populate Budget Tree
        for item in self.budget_tree.get_children():
            self.budget_tree.delete(item)

        for s in statuses:
            self.budget_tree.insert(
                "",
                "end",
                values=(
                    s["category_name"],
                    f"{s['allocated']:,.0f}",
                    f"{s['spent']:,.0f}",
                    f"{s['remaining']:,.0f}",
                    f"{s['percentage_used']}%"
                )
            )

        # Populate Recent Tree
        for item in self.recent_tree.get_children():
            self.recent_tree.delete(item)

        recents = self.controller.trans_service.get_recent_transactions(limit=10)
        for r in recents:
            prefix = "-" if r["category_type"] == "expense" else "+"
            self.recent_tree.insert(
                "",
                "end",
                values=(
                    r["trans_date"],
                    r["category_name"],
                    f"{prefix}{r['amount']:,.0f} PKR"
                )
            )
