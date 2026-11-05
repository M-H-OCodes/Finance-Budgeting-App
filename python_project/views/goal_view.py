"""
Savings Goal Tracker View (Modern Dark Theme Edition)
"""

import tkinter as tk
from tkinter import ttk, messagebox
from config import COLORS, CURRENCY_SYMBOL

class GoalView(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=COLORS["bg_main"])
        self.controller = controller
        self._build_ui()

    def _build_ui(self):
        header = tk.Frame(self, bg=COLORS["bg_main"], pady=16, padx=24)
        header.pack(fill="x")

        tk.Label(
            header,
            text="Savings Goal Tracker (Criterion 12)",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["bg_main"]
        ).pack(side="left")

        # Container
        content = tk.Frame(self, bg=COLORS["bg_main"], padx=24)
        content.pack(fill="both", expand=True)
        content.columnconfigure(0, weight=3)
        content.columnconfigure(1, weight=2)

        # Left: Progress Card
        card = tk.Frame(content, bg=COLORS["card_bg"], padx=20, pady=20)
        card.grid(row=0, column=0, sticky="nsew", padx=(0, 12), pady=(0, 20))

        tk.Label(
            card,
            text="ACTIVE MILESTONE",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 8, "bold"),
            fg=COLORS["text_muted"],
            bg=COLORS["card_bg"]
        ).pack(anchor="w")

        self.lbl_goal = tk.Label(
            card,
            text="Littmann Classic III Stethoscope",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg="#38BDF8",
            bg=COLORS["card_bg"]
        )
        self.lbl_goal.pack(anchor="w", pady=(4, 14))

        # Progress bar
        self.bar = ttk.Progressbar(card, orient="horizontal", mode="determinate", length=400, maximum=100)
        self.bar.pack(fill="x", pady=6)

        self.lbl_pct = tk.Label(
            card,
            text="76.0% Achieved",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 11, "bold"),
            fg="#34D399",
            bg=COLORS["card_bg"]
        )
        self.lbl_pct.pack(anchor="e")

        # Metric grid
        m_frame = tk.Frame(card, bg=COLORS["card_bg"], pady=12)
        m_frame.pack(fill="x")
        m_frame.columnconfigure(0, weight=1)
        m_frame.columnconfigure(1, weight=1)

        self.lbl_target = self._metric_box(m_frame, 0, "TARGET AMOUNT", "25,000 PKR")
        self.lbl_deadline = self._metric_box(m_frame, 1, "DEADLINE", "2026-12-31")
        self.lbl_saved = self._metric_box(m_frame, 2, "NET SAVED TO DATE", "19,000 PKR")
        self.lbl_needed = self._metric_box(m_frame, 3, "REMAINING NEEDED", "6,000 PKR")

        # Right: Define New Goal Form
        form_card = tk.Frame(content, bg=COLORS["card_bg"], padx=18, pady=18)
        form_card.grid(row=0, column=1, sticky="nsew", pady=(0, 20))

        tk.Label(
            form_card,
            text="Update Savings Target",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 11, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["card_bg"]
        ).pack(anchor="w", pady=(0, 10))

        tk.Label(form_card, text="Milestone Name:", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_name = ttk.Entry(form_card)
        self.ent_name.insert(0, "Littmann Classic III Stethoscope")
        self.ent_name.pack(fill="x", pady=(2, 8))

        tk.Label(form_card, text=f"Target Amount ({CURRENCY_SYMBOL}):", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_target = ttk.Entry(form_card)
        self.ent_target.insert(0, "25000")
        self.ent_target.pack(fill="x", pady=(2, 8))

        tk.Label(form_card, text="Target Date (YYYY-MM-DD):", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_date = ttk.Entry(form_card)
        self.ent_date.insert(0, "2026-12-31")
        self.ent_date.pack(fill="x", pady=(2, 14))

        btn_save = tk.Button(
            form_card,
            text="🎯 Set Active Milestone",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
            bg=COLORS["primary"],
            fg="#FFFFFF",
            bd=0,
            pady=8,
            cursor="hand2",
            command=self._save_goal
        )
        btn_save.pack(fill="x")

    def _metric_box(self, parent, index, title, val):
        r, c = index // 2, index % 2
        f = tk.Frame(parent, bg="#0E1526", padx=10, pady=8)
        f.grid(row=r, column=c, padx=4, pady=4, sticky="nsew")
        tk.Label(f, text=title, font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 7, "bold"), fg=COLORS["text_muted"], bg="#0E1526").pack(anchor="w")
        l = tk.Label(f, text=val, font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 11, "bold"), fg=COLORS["text_bright"], bg="#0E1526")
        l.pack(anchor="w", pady=(2, 0))
        return l

    def _save_goal(self):
        try:
            self.controller.forecast_service.set_savings_goal(
                self.ent_name.get(), self.ent_target.get(), self.ent_date.get()
            )
            messagebox.showinfo("Success", "New savings target saved!")
            self.refresh_data()
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def refresh_data(self):
        res = self.controller.forecast_service.get_savings_goal_progress()
        if res:
            self.lbl_goal.config(text=res["goal_name"])
            self.bar["value"] = res["progress_percentage"]
            self.lbl_pct.config(text=f"{res['progress_percentage']}% ({res['net_saved']:,.0f} / {res['target_amount']:,.0f} PKR)")
            self.lbl_target.config(text=f"{res['target_amount']:,.0f} PKR")
            self.lbl_deadline.config(text=res["target_date"])
            self.lbl_saved.config(text=f"{res['net_saved']:,.0f} PKR")
            self.lbl_needed.config(text=f"{res['remaining_needed']:,.0f} PKR")
