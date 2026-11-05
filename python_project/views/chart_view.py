"""
Visual Spending Analysis View (Modern Dark Theme Edition)
Embeds dark-themed Matplotlib charts directly inside Tkinter.
"""

import tkinter as tk
from tkinter import ttk
from datetime import datetime
from config import COLORS

try:
    import matplotlib
    matplotlib.use("TkAgg")
    import matplotlib.pyplot as plt
    from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False

class ChartView(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg=COLORS["bg_main"])
        self.controller = controller
        self.current_month = datetime.now().strftime("%Y-%m")
        self._build_ui()

    def _build_ui(self):
        header = tk.Frame(self, bg=COLORS["bg_main"], pady=16, padx=24)
        header.pack(fill="x")

        tk.Label(
            header,
            text="Visual Spending Analytics (Criterion 5)",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 16, "bold"),
            fg=COLORS["text_bright"],
            bg=COLORS["bg_main"]
        ).pack(side="left")

        # Container
        self.chart_container = tk.Frame(self, bg=COLORS["card_bg"], padx=14, pady=14)
        self.chart_container.pack(fill="both", expand=True, padx=24, pady=(0, 20))

    def refresh_data(self):
        for widget in self.chart_container.winfo_children():
            widget.destroy()

        if not MATPLOTLIB_AVAILABLE:
            tk.Label(
                self.chart_container,
                text="Install matplotlib for dark theme embedded charts:\npip install matplotlib",
                font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 12),
                fg=COLORS["text_muted"],
                bg=COLORS["card_bg"]
            ).pack(expand=True)
            return

        statuses = self.controller.budget_service.get_monthly_budget_status(self.current_month)
        categories = []
        spent_amounts = []
        budget_amounts = []

        for s in statuses:
            if s["spent"] > 0 or s["allocated"] > 0:
                categories.append(s["category_name"])
                spent_amounts.append(s["spent"])
                budget_amounts.append(s["allocated"])

        total_spent = sum(spent_amounts)

        if total_spent == 0 and sum(budget_amounts) == 0:
            tk.Label(
                self.chart_container,
                text=f"No spending records found for {self.current_month}.\nLog some transactions first to view graphs!",
                font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 12),
                fg=COLORS["text_muted"],
                bg=COLORS["card_bg"]
            ).pack(expand=True)
            return

        # Modern Dark-themed Matplotlib Figure
        fig, (ax_pie, ax_bar) = plt.subplots(1, 2, figsize=(9.6, 4.6), dpi=100)
        fig.patch.set_facecolor('#131B2E')
        ax_pie.set_facecolor('#131B2E')
        ax_bar.set_facecolor('#131B2E')

        # Palette
        palette = ['#38BDF8', '#34D399', '#FBBF24', '#F43F5E', '#A78BFA', '#F472B6']

        # Panel 1: Expenditure Pie Chart
        if total_spent > 0:
            pie_cats = [c for c, s in zip(categories, spent_amounts) if s > 0]
            pie_vals = [s for s in spent_amounts if s > 0]
            wedges, texts, autotexts = ax_pie.pie(
                pie_vals,
                labels=pie_cats,
                autopct='%1.1f%%',
                startangle=140,
                colors=palette[:len(pie_vals)],
                textprops={'fontsize': 8, 'color': '#E2E8F0'}
            )
            for autotext in autotexts:
                autotext.set_color('#0F172A')
                autotext.set_weight('bold')

            ax_pie.set_title(f"Spending Breakdown ({total_spent:,.0f} PKR)", fontsize=11, fontweight='bold', color='#F8FAFC', pad=12)
        else:
            ax_pie.text(0.5, 0.5, "No Expenses Yet", ha='center', va='center', fontsize=10, color='#94A3B8')
            ax_pie.axis('off')

        # Panel 2: Budget vs. Actual Bar Chart
        indices = range(len(categories))
        bar_width = 0.35

        ax_bar.bar([i - bar_width/2 for i in indices], budget_amounts, width=bar_width, label='Budget Limit', color='#0284C7')
        ax_bar.bar([i + bar_width/2 for i in indices], spent_amounts, width=bar_width, label='Actual Spent', color='#34D399')

        ax_bar.set_xticks(indices)
        ax_bar.set_xticklabels(categories, rotation=25, ha='right', fontsize=8, color='#94A3B8')
        ax_bar.set_ylabel("PKR", fontsize=9, color='#94A3B8')
        ax_bar.set_title("Budget vs. Actual Spending", fontsize=11, fontweight='bold', color='#F8FAFC', pad=12)
        ax_bar.legend(fontsize=8, facecolor='#1E293B', edgecolor='#334155', labelcolor='#F8FAFC')
        ax_bar.grid(axis='y', linestyle='--', alpha=0.15, color='#FFFFFF')
        ax_bar.tick_params(colors='#94A3B8')
        for spine in ax_bar.spines.values():
            spine.set_color('#1E293B')

        plt.tight_layout()

        canvas = FigureCanvasTkAgg(fig, master=self.chart_container)
        canvas.draw()
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        plt.close(fig)
