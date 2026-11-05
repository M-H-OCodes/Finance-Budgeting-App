"""
Transaction View (Modern Dark Theme Edition)
"""

import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime
from config import COLORS, CURRENCY_SYMBOL

class TransactionView(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=COLORS["bg_main"])
        self.controller = controller
        self._build_ui()

    def _build_ui(self):
        header = tk.Frame(self, bg=COLORS["bg_main"], pady=16, padx=24)
        header.pack(fill="x")
        tk.Label(
            header,
            text="Record Income / Expense",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["bg_main"]
        ).pack(side="left")

        content = tk.Frame(self, bg=COLORS["bg_main"], padx=24)
        content.pack(fill="both", expand=True)
        content.columnconfigure(0, weight=1)
        content.columnconfigure(1, weight=1)

        # Form Card
        form_card = tk.Frame(content, bg=COLORS["card_bg"], padx=18, pady=18)
        form_card.grid(row=0, column=0, sticky="nsew", padx=(0, 12), pady=(0, 20))

        tk.Label(
            form_card,
            text="New Entry",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 12, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["card_bg"]
        ).pack(anchor="w", pady=(0, 10))

        # Type Selector
        self.var_type = tk.StringVar(value="expense")
        t_frame = tk.Frame(form_card, bg=COLORS["card_bg"])
        t_frame.pack(anchor="w", pady=(0, 12))
        tk.Radiobutton(
            t_frame, text="Expense (-)", variable=self.var_type, value="expense",
            bg=COLORS["card_bg"], fg=COLORS["text_bright"], selectcolor="#0E1526",
            command=self.refresh_data
        ).pack(side="left", padx=(0, 14))
        tk.Radiobutton(
            t_frame, text="Income / Stipend (+)", variable=self.var_type, value="income",
            bg=COLORS["card_bg"], fg=COLORS["text_bright"], selectcolor="#0E1526",
            command=self.refresh_data
        ).pack(side="left")

        tk.Label(form_card, text=f"Amount ({CURRENCY_SYMBOL}):", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_amt = ttk.Entry(form_card)
        self.ent_amt.pack(fill="x", pady=(2, 8))

        tk.Label(form_card, text="Date (YYYY-MM-DD):", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_date = ttk.Entry(form_card)
        self.ent_date.insert(0, datetime.now().strftime("%Y-%m-%d"))
        self.ent_date.pack(fill="x", pady=(2, 8))

        tk.Label(form_card, text="Category:", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.combo_cat = ttk.Combobox(form_card, state="readonly")
        self.combo_cat.pack(fill="x", pady=(2, 8))

        tk.Label(form_card, text="Description / Memo:", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(anchor="w")
        self.ent_desc = ttk.Entry(form_card)
        self.ent_desc.pack(fill="x", pady=(2, 16))

        tk.Button(
            form_card,
            text="💾 Save Transaction Offline",
            bg=COLORS["primary"],
            fg="#FFFFFF",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
            bd=0,
            pady=9,
            cursor="hand2",
            command=self._save
        ).pack(fill="x")

        # Right: Activity Log
        r_panel = tk.Frame(content, bg=COLORS["card_bg"], padx=18, pady=18)
        r_panel.grid(row=0, column=1, sticky="nsew", pady=(0, 20))

        tk.Label(
            r_panel,
            text="Recent Records",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 12, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["card_bg"]
        ).pack(anchor="w", pady=(0, 10))

        cols = ("id", "date", "cat", "desc", "amt")
        self.tree = ttk.Treeview(r_panel, columns=cols, show="headings", height=12)
        self.tree.heading("id", text="#")
        self.tree.heading("date", text="Date")
        self.tree.heading("cat", text="Category")
        self.tree.heading("desc", text="Description")
        self.tree.heading("amt", text="Amount")

        self.tree.column("id", width=30, anchor="center")
        self.tree.column("date", width=80, anchor="center")
        self.tree.column("cat", width=110, anchor="w")
        self.tree.column("desc", width=130, anchor="w")
        self.tree.column("amt", width=80, anchor="e")

        self.tree.pack(fill="both", expand=True)

    def _save(self):
        cat_name = self.combo_cat.get()
        cats = self.controller.db.get_all_categories()
        cid = next((c["category_id"] for c in cats if c["name"] == cat_name), None)
        try:
            self.controller.trans_service.validate_and_record_transaction(
                self.ent_amt.get(), self.ent_date.get(), self.ent_desc.get(), cid
            )
            messagebox.showinfo("Success", "Transaction recorded successfully!")
            self.ent_amt.delete(0, tk.END)
            self.ent_desc.delete(0, tk.END)
            self.refresh_data()
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def refresh_data(self):
        cats = self.controller.db.get_all_categories(self.var_type.get())
        self.combo_cat["values"] = [c["name"] for c in cats]
        if cats: self.combo_cat.current(0)
        for i in self.tree.get_children(): self.tree.delete(i)
        for r in self.controller.trans_service.get_recent_transactions(15):
            prefix = "-" if r["category_type"] == "expense" else "+"
            self.tree.insert("", "end", values=(r["transaction_id"], r["trans_date"], r["category_name"], r["description"], f"{prefix}{r['amount']:,.0f}"))
