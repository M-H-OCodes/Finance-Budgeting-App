============================================================
PERSONAL FINANCE MANAGER - STUDENT HOSTEL EDITION
IB DP Computer Science SL Internal Assessment Product
100% OFFLINE STANDALONE APPLICATION (NO INTERNET REQUIRED)
============================================================

This package contains TWO offline desktop interfaces for your device,
running 100% locally with zero internet connection:

1. MODERN HIGH-END DESKTOP APP (RECOMMENDED)
   - The exact sleek, responsive UI with interactive doughnut & bar
     charts, smooth animations, quick category sliders, and the Admin
     User Management console.
   - Runs in a dedicated native window (Chrome / Edge app-mode) served
     by Python's zero-dependency local offline server.
   - Data persists completely on your local device.

2. PYTHON TKINTER DESKTOP APP (DARK SLATE EDITION)
   - Built with standard Python Tkinter and SQLite3.
   - Redesigned with a modern Dark Slate palette (#0B0F19 / #131B2E),
     styled Treeviews, and dark embedded Matplotlib charts.
   - Ideal for IB DP Computer Science Criterion C code submission.

HOW TO RUN:
-----------
* ON WINDOWS:
  Double-click "run_windows.bat"
  - Select [1] to launch the Modern High-End App (Default)
  - Select [2] to launch the Python Tkinter Dark Edition
  - Select [3] to run the 20-point automated test suite

* ON MAC / LINUX:
  Double-click "run_mac_linux.sh" (or run: bash run_mac_linux.sh in Terminal)
  - Choose [1] for Modern High-End App, or [2] for Python Tkinter

REQUIREMENTS:
-------------
Standard Python 3 (Tkinter, SQLite, and http.server are built into Python).
To enable embedded charts in the Tkinter edition, install matplotlib once:
  pip install matplotlib

AUTOMATED TEST SUITE (Criterion E):
-----------------------------------
Run: python3 test_suite.py
Verifies all 20 test cases (normal, boundary, edge, erroneous inputs).

DATA PERSISTENCE:
-----------------
All data is stored locally on your device with zero cloud tracking.
============================================================
