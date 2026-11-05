"""
Main Window Controller for Personal Finance Manager
Modern Dark Slate UI with Sidebar Navigation and Stacked Frames
"""

import tkinter as tk
from tkinter import ttk
from config import APP_TITLE, WINDOW_WIDTH, WINDOW_HEIGHT, COLORS

class MainWindow(tk.Tk):
    def __init__(self, db_manager, trans_service, budget_service, forecast_service):
        super().__init__()
        self.title(APP_TITLE)
        self.geometry(f"{WINDOW_WIDTH}x{WINDOW_HEIGHT}")
        self.minsize(1020, 680)
        self.configure(bg=COLORS["bg_main"])

        # Inject services
        self.db = db_manager
        self.trans_service = trans_service
        self.budget_service = budget_service
        self.forecast_service = forecast_service

        self._setup_modern_styles()
        self._build_layout()

    def _setup_modern_styles(self):
        style = ttk.Style(self)
        try:
            style.theme_use("clam")
        except tk.TclError:
            pass

        font_family = "Segoe UI" if "Segoe UI" in tk.font.families() else ("SF Pro Display" if "SF Pro Display" in tk.font.families() else "Helvetica")

        # Global modern dark styling
        style.configure(".", font=(font_family, 10), background=COLORS["bg_main"], foreground=COLORS["text_dark"])
        style.configure("TFrame", background=COLORS["bg_main"])
        style.configure("Card.TFrame", background=COLORS["card_bg"])
        
        # Modern Treeview Styling
        style.configure(
            "Treeview",
            background=COLORS["card_bg"],
            foreground=COLORS["text_bright"],
            fieldbackground=COLORS["card_bg"],
            rowheight=32,
            font=(font_family, 9),
            borderwidth=0
        )
        style.configure(
            "Treeview.Heading",
            background=COLORS["card_border"],
            foreground=COLORS["text_muted"],
            font=(font_family, 9, "bold"),
            relief="flat",
            padding=6
        )
        style.map("Treeview", background=[("selected", COLORS["primary"])], foreground=[("selected", "#FFFFFF")])
        
        # Modern Progressbar
        style.configure(
            "Horizontal.TProgressbar",
            troughcolor=COLORS["card_border"],
            background=COLORS["primary"],
            darkcolor=COLORS["primary"],
            lightcolor=COLORS["primary"],
            bordercolor=COLORS["card_border"],
            thickness=10
        )

        # Modern Entry & Combobox
        style.configure("TEntry", fieldbackground=COLORS["card_bg"], foreground=COLORS["text_bright"], bordercolor=COLORS["card_border"])
        style.configure("TCombobox", fieldbackground=COLORS["card_bg"], foreground=COLORS["text_bright"])

    def _build_layout(self):
        self.columnconfigure(0, weight=0, minsize=240)
        self.columnconfigure(1, weight=1)
        self.rowconfigure(0, weight=1)

        # 1. Left Sidebar
        self.sidebar = tk.Frame(self, bg=COLORS["sidebar_bg"], width=240)
        self.sidebar.grid(row=0, column=0, sticky="nsew")
        self.sidebar.grid_propagate(False)

        # Brand Header
        brand_frame = tk.Frame(self.sidebar, bg=COLORS["sidebar_bg"], padx=18, pady=20)
        brand_frame.pack(fill="x")

        lbl_brand = tk.Label(
            brand_frame,
            text="FINANCE MANAGER",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 13, "bold"),
            fg="#38BDF8",
            bg=COLORS["sidebar_bg"],
            anchor="w"
        )
        lbl_brand.pack(fill="x")

        lbl_sub = tk.Label(
            brand_frame,
            text="Hostel Medical Student Edition\nStipend: 40,000 PKR / mo",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 8),
            fg=COLORS["text_muted"],
            bg=COLORS["sidebar_bg"],
            justify="left",
            pady=4,
            anchor="w"
        )
        lbl_sub.pack(fill="x")

        lbl_badge = tk.Label(
            brand_frame,
            text="● 100% Offline Device Mode",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 8, "bold"),
            fg="#34D399",
            bg="#0B2E1E",
            padx=8,
            pady=3,
            anchor="w"
        )
        lbl_badge.pack(anchor="w", pady=(6, 0))

        # Nav Buttons Container
        nav_container = tk.Frame(self.sidebar, bg=COLORS["sidebar_bg"], padx=10, pady=10)
        nav_container.pack(fill="both", expand=True)

        # 2. Main Content Container
        self.content_container = tk.Frame(self, bg=COLORS["bg_main"])
        self.content_container.grid(row=0, column=1, sticky="nsew")
        self.content_container.columnconfigure(0, weight=1)
        self.content_container.rowconfigure(0, weight=1)

        from views.dashboard_view import DashboardView
        from views.transaction_view import TransactionView
        from views.budget_view import BudgetView
        from views.chart_view import ChartView
        from views.history_view import HistoryView
        from views.goal_view import GoalView

        self.frames = {}
        views = [
            ("Dashboard", DashboardView, "📊"),
            ("Log Transaction", TransactionView, "✍️"),
            ("Monthly Budgets", BudgetView, "🎯"),
            ("Visual Analytics", ChartView, "📈"),
            ("Search & History", HistoryView, "🔍"),
            ("Savings Goal", GoalView, "🏆")
        ]

        self.nav_buttons = {}
        for title, view_cls, icon in views:
            btn = tk.Button(
                nav_container,
                text=f"  {icon}  {title}",
                anchor="w",
                font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 10),
                fg=COLORS["text_muted"],
                bg=COLORS["sidebar_bg"],
                activebackground=COLORS["primary"],
                activeforeground="#FFFFFF",
                bd=0,
                padx=14,
                pady=11,
                cursor="hand2",
                command=lambda cls=view_cls: self.show_frame(cls)
            )
            btn.pack(fill="x", pady=2)
            self.nav_buttons[view_cls] = btn

            frame = view_cls(parent=self.content_container, controller=self)
            self.frames[view_cls] = frame
            frame.grid(row=0, column=0, sticky="nsew")

        # Footer
        lbl_foot = tk.Label(
            self.sidebar,
            text="IB CS SL Internal Assessment\nCriterion B & E Solution",
            font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 8),
            fg="#64748B",
            bg=COLORS["sidebar_bg"],
            pady=16
        )
        lbl_foot.pack(side="bottom", fill="x")

        self.show_frame(DashboardView)

    def show_frame(self, view_class):
        frame = self.frames[view_class]
        frame.tkraise()
        for cls, btn in self.nav_buttons.items():
            if cls == view_class:
                btn.configure(
                    bg="#1E293B",
                    fg="#38BDF8",
                    font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 10, "bold")
                )
            else:
                btn.configure(
                    bg=COLORS["sidebar_bg"],
                    fg=COLORS["text_muted"],
                    font=("Segoe UI" if "Segoe UI" in tk.font.families() else "Helvetica", 10)
                )
        if hasattr(frame, "refresh_data"):
            frame.refresh_data()
