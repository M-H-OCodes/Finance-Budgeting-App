#!/usr/bin/env bash
# Personal Finance Manager (Hostel Edition) - Offline Launcher
cd "$(dirname "$0")"

echo "==================================================================="
echo "  PERSONAL FINANCE MANAGER - STUDENT HOSTEL EDITION"
echo "  100% OFFLINE ON-DEVICE LAUNCHER (ZERO INTERNET REQUIRED)"
echo "==================================================================="
echo ""
echo "  Choose your preferred desktop interface:"
echo ""
echo "  [1] Modern High-End Desktop App (Recommended - Sleek & Full Features)"
echo "  [2] Python Tkinter Desktop App (Dark Slate Edition)"
echo "  [3] Run Automated 20-Point Test Suite (IB Criterion E Verification)"
echo ""
read -p "Enter choice (1-3) [Default: 1]: " opt
opt=${opt:-1}

if [ "$opt" = "1" ]; then
    echo "Starting Modern Offline Interface..."
    python3 launch_offline_ui.py || python launch_offline_ui.py
elif [ "$opt" = "2" ]; then
    echo "Starting Python Tkinter Interface..."
    python3 main.py || python main.py
elif [ "$opt" = "3" ]; then
    echo "Running Automated Test Suite..."
    python3 test_suite.py || python test_suite.py
fi
