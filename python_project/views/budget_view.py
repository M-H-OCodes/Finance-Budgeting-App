"""
Budget Setup View (Modern Dark Theme Edition)
"""

import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime
from config import COLORS, CURRENCY_SYMBOL

class BudgetView(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=COLORS["bg_main"])
        self.controller = controller
        self.entries = {}
        self._build_ui()

    def _build_ui(self):
        header = tk.Frame(self, bg=COLORS["bg_main"], pady=16, padx=24)
        header.pack(fill="x")
        tk.Label(
            header,
            text="Monthly Budget Allocation",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["bg_main"]
        ).pack(side="left")

        content = tk.Frame(self, bg=COLORS["bg_main"], padx=24)
        content.pack(fill="both", expand=True)
        content.columnconfigure(0, weight=1)
        content.columnconfigure(1, weight=1)

        # Quick Suggester
        s_box = tk.Frame(content, bg=COLORS["card_bg"], padx=18, pady=18)
        s_box.grid(row=0, column=0, sticky="nsew", padx=(0, 12), pady=(0, 20))

        tk.Label(s_box, text="Quick Allocation Assistant", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 12, "bold"), fg=COLORS["text_bright"], bg=COLORS["card_bg"]).pack(anchor="w", pady=(0, 10))

        tk.Label(s_box, text="Monthly Stipend (PKR):", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_stipend = ttk.Entry(s_box)
        self.ent_stipend.insert(0, "40000")
        self.ent_stipend.pack(fill="x", pady=(2, 8))

        tk.Label(s_box, text="Target Monthly Savings (PKR):", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_sav = ttk.Entry(s_box)
        self.ent_sav.insert(0, "6000")
        self.ent_sav.pack(fill="x", pady=(2, 14))

        tk.Button(
            s_box,
            text="✨ Auto-Suggest Student Limits (40/15/15/15/15)",
            bg="#D97706",
            fg="#FFFFFF",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
            bd=0,
            pady=8,
            cursor="hand2",
            command=self._suggest
        ).pack(fill="x")

        # Category Limits Box
        self.limits_box = tk.Frame(content, bg=COLORS["card_bg"], padx=18, pady=18)
        self.limits_box.grid(row=0, column=1, sticky="nsew", pady=(0, 20))

        tk.Label(self.limits_box, text="Category Spending Ceilings", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 12, "bold"), fg=COLORS["text_bright"], bg=COLORS["card_bg"]).grid(row=0, column=0, columnspan=2, sticky="w", pady=(0, 10))

        self.btn_save = tk.Button(
            self.limits_box,
            text="💾 Save Budget Allocations",
            bg=COLORS["primary"],
            fg="#FFFFFF",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
            bd=0,
            pady=8,
            cursor="hand2",
            command=self._save_all
        )

    def _suggest(self):
        res = self.controller.budget_service.suggest_budget_distribution(self.ent_stipend.get(), self.ent_sav.get())
        for cid, (name, ent) in self.entries.items():
            if name in res["allocations"]:
                ent.delete(0, tk.END)
                ent.insert(0, str(int(res["allocations"][name])))
        messagebox.showinfo("Applied", f"Allocated {res['spending_pool']:,.0f} PKR across 5 categories! Click Save.")

    def _save_all(self):
        month = datetime.now().strftime("%Y-%m")
        for cid, (name, ent) in self.entries.items():
            try:
                self.controller.budget_service.set_budget(cid, month, ent.get())
            except Exception as e:
                messagebox.showerror("Error", str(e))
                return
        messagebox.showinfo("Success", "Budgets updated successfully!")
        self.refresh_data()

    def refresh_data(self):
        cats = self.controller.db.get_all_categories("expense")
        status = {s["category_id"]: s["allocated"] for s in self.controller.budget_service.get_monthly_budget_status(datetime.now().strftime("%Y-%m"))}

        # Clear existing dynamic entries
        for w in self.limits_box.grid_slaves():
            if int(w.grid_info()["row"]) > 0:
                w.grid_forget()

        self.entries.clear()
        row = 1
        for c in cats:
            lbl = tk.Label(self.limits_box, text=c["name"], font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"])
            lbl.grid(row=row, column=0, sticky="w", pady=4)

            ent = ttk.Entry(self.limits_box, width=12)
            ent.insert(0, str(int(status.get(c["category_id"], 0))))
            ent.grid(row=row, column=1, sticky="e", pady=4, padx=(10, 0))

            self.entries[c["category_id"]] = (c["name"], ent)
            row += 1

        self.btn_save.grid(row=row + 1, column=0, columnspan=2, sticky="ew", pady=(14, 0))
