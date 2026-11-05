"""
Configuration settings for Personal Finance Manager
Tailored for IB CS SL Internal Assessment (Hostel Medical Student Client)
Modern Dark Slate UI Theme
"""

APP_TITLE = "Personal Finance Manager (Hostel Edition) - Offline Desktop"
WINDOW_WIDTH = 1120
WINDOW_HEIGHT = 740

# Client Defaults
DEFAULT_MONTHLY_STIPEND = 40000.0  # PKR
CURRENCY_SYMBOL = "PKR"

# Predefined Categories (Criterion 2)
PREDEFINED_CATEGORIES = [
    ("Food & Mess", "expense"),
    ("Transport / Fuel", "expense"),
    ("Education & Books", "expense"),
    ("Personal Care & Laundry", "expense"),
    ("Entertainment", "expense"),
    ("Miscellaneous", "expense"),
    ("Monthly Stipend", "income"),
    ("Other Allowance", "income")
]

# Suggested Budget Allocation Ratios (Criterion 11)
SUGGESTED_RATIOS = {
    "Food & Mess": 0.40,
    "Transport / Fuel": 0.15,
    "Education & Books": 0.15,
    "Personal Care & Laundry": 0.15,
    "Miscellaneous": 0.15
}

# Modern Dark Slate Theme Colors (Matching High-End Web Interface)
COLORS = {
    "bg_main": "#0B0F19",       # Deep Void Slate
    "card_bg": "#131B2E",       # Elevated Dark Card Surface
    "card_border": "#1E293B",   # Hairline Slate Border
    "sidebar_bg": "#070A12",    # Ultra-Dark Sidebar
    "sidebar_active": "#0284C7",# Active Nav Cyan Blue
    "primary": "#0284C7",       # Sky Blue Accent
    "primary_hover": "#0369A1",
    "accent": "#0D9488",        # Teal Accent
    "text_bright": "#F8FAFC",   # Bright White Heading
    "text_dark": "#F1F5F9",     # Light Text for Dark Mode
    "text_muted": "#94A3B8",    # Muted Slate Gray
    "danger": "#F43F5E",        # Modern Rose Red
    "danger_bg": "#3B1219",
    "warning": "#F59E0B",       # Warm Amber
    "warning_bg": "#36220B",
    "success": "#10B981",       # Emerald Green
    "success_bg": "#0B2E1E"
}
