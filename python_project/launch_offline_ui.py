"""
Offline Desktop Launcher for Personal Finance Manager
Serves the modern interface locally on localhost and opens in dedicated native app window.
100% Offline, Zero external dependencies, Zero internet required.
"""

import http.server
import socketserver
import webbrowser
import threading
import subprocess
import shutil
import sys
import os

PORT = 8080

def get_base_dir():
    # If running from inside python_project or app root
    current = os.path.dirname(os.path.abspath(__file__))
    if os.path.exists(os.path.join(current, "dist")):
        return os.path.join(current, "dist")
    parent = os.path.dirname(current)
    if os.path.exists(os.path.join(parent, "dist")):
        return os.path.join(parent, "dist")
    if os.path.exists(os.path.join(current, "offline_ui")):
        return os.path.join(current, "offline_ui")
    return current

class OfflineHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=get_base_dir(), **kwargs)

    def log_message(self, format, *args):
        # Quiet logger
        pass

def launch_app_window(url):
    """Attempts to launch Chrome or Edge in standalone native app mode (--app)."""
    # 1. Check Chrome
    chrome_paths = [
        # Windows
        os.path.expandvars(r"%ProgramFiles%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%LocalAppData%\Google\Chrome\Application\chrome.exe"),
        # Mac
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        # Linux
        "google-chrome",
        "chrome",
        "chromium-browser",
        "chromium"
    ]

    for p in chrome_paths:
        cmd = shutil.which(p) or (p if os.path.exists(p) else None)
        if cmd:
            try:
                subprocess.Popen([cmd, f"--app={url}", "--window-size=1200,800"])
                return
            except Exception:
                pass

    # 2. Check Edge
    edge_paths = [
        os.path.expandvars(r"%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"),
        os.path.expandvars(r"%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"),
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
        "microsoft-edge"
    ]

    for p in edge_paths:
        cmd = shutil.which(p) or (p if os.path.exists(p) else None)
        if cmd:
            try:
                subprocess.Popen([cmd, f"--app={url}", "--window-size=1200,800"])
                return
            except Exception:
                pass

    # 3. Fallback to standard default browser
    webbrowser.open(url)

def main():
    base_dir = get_base_dir()
    print("=" * 65)
    print("PERSONAL FINANCE MANAGER - STUDENT HOSTEL EDITION")
    print("Launching modern offline interface...")
    print(f"Directory: {base_dir}")
    print("=" * 65)

    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    server_started = False
    port = PORT
    httpd = None

    for attempt in range(5):
        try:
            httpd = socketserver.TCPServer(("127.0.0.1", port), OfflineHandler)
            server_started = True
            break
        except OSError:
            port += 1

    if not server_started or httpd is None:
        print("[Error] Could not bind local port. Opening file directly...")
        index_file = os.path.join(base_dir, "index.html")
        webbrowser.open(f"file://{index_file}")
        return

    url = f"http://127.0.0.1:{port}"
    print(f"[System] Local offline server running at: {url}")
    print("[System] Opening dedicated modern app window (no internet required)...")

    # Launch app window in thread after 0.5s
    timer = threading.Timer(0.5, lambda: launch_app_window(url))
    timer.start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[System] Offline app stopped.")
        httpd.shutdown()

if __name__ == "__main__":
    main()
