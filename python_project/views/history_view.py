"""
History & Search View (Modern Dark Theme Edition)
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from config import COLORS

class HistoryView(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=COLORS["bg_main"])
        self.controller = controller
        self._build_ui()

    def _build_ui(self):
        header = tk.Frame(self, bg=COLORS["bg_main"], pady=16, padx=24)
        header.pack(fill="x")
        tk.Label(
            header,
            text="Transaction History & Search Filter",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["bg_main"]
        ).pack(side="left")

        # Filter bar
        f_box = tk.Frame(self, bg=COLORS["card_bg"], padx=18, pady=14)
        f_box.pack(fill="x", padx=24, pady=(0, 14))

        tk.Label(f_box, text="Keyword:", font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9), fg=COLORS["text_muted"], bg=COLORS["card_bg"]).pack(side="left")
        self.ent_key = ttk.Entry(f_box, width=18)
        self.ent_key.pack(side="left", padx=(6, 16))

        btn_search = tk.Button(
            f_box,
            text="🔍 Apply Filter",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9, "bold"),
            bg=COLORS["primary"],
            fg="#FFFFFF",
            bd=0,
            padx=12,
            pady=4,
            cursor="hand2",
            command=self.refresh_data
        )
        btn_search.pack(side="left", padx=(0, 8))

        btn_reset = tk.Button(
            f_box,
            text="Reset",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 9),
            bg="#1E293B",
            fg=COLORS["text_muted"],
            bd=0,
            padx=10,
            pady=4,
            cursor="hand2",
            command=self._reset
        )
        btn_reset.pack(side="left")

        # Treeview
        table_card = tk.Frame(self, bg=COLORS["card_bg"], padx=14, pady=14)
        table_card.pack(fill="both", expand=True, padx=24, pady=(0, 20))

        cols = ("id", "date", "type", "cat", "desc", "amt")
        self.tree = ttk.Treeview(table_card, columns=cols, show="headings")
        self.tree.heading("id", text="#")
        self.tree.heading("date", text="Date")
        self.tree.heading("type", text="Type")
        self.tree.heading("cat", text="Category")
        self.tree.heading("desc", text="Description")
        self.tree.heading("amt", text="Amount (PKR)")

        self.tree.column("id", width=35, anchor="center")
        self.tree.column("date", width=85, anchor="center")
        self.tree.column("type", width=80, anchor="center")
        self.tree.column("cat", width=120, anchor="w")
        self.tree.column("desc", width=220, anchor="w")
        self.tree.column("amt", width=100, anchor="e")

        self.tree.pack(fill="both", expand=True)

    def _reset(self):
        self.ent_key.delete(0, tk.END)
        self.refresh_data()

    def refresh_data(self):
        for i in self.tree.get_children():
            self.tree.delete(i)
        records = self.controller.trans_service.search_transactions(keyword=self.ent_key.get())
        for r in records:
            prefix = "-" if r["category_type"] == "expense" else "+"
            self.tree.insert(
                "", "end",
                values=(
                    r["transaction_id"],
                    r["trans_date"],
                    r["category_type"].upper(),
                    r["category_name"],
                    r["description"],
                    f"{prefix}{r['amount']:,.0f}"
                )
            )
