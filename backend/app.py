"""
====================================================================
My First-Code Fullstack - Python API Server
Created with passion for @novalizerazizi
====================================================================
Demonstrates how to build a clean REST API in Python using standard library.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sys
import platform
from datetime import datetime

PORT = 8000

class FullstackAPIHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        if self.path == '/api/health':
            self._set_headers(200)
            data = {
                "status": "healthy",
                "server": "Python Native HTTP Server",
                "pythonVersion": platform.python_version(),
                "platform": platform.system(),
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
            self.wfile.write(json.dumps(data).encode('utf-8'))
        elif self.path == '/api/welcome':
            self._set_headers(200)
            data = {
                "message": "Welcome to Python Fullstack Backend by @novalizerazizi!",
                "tips": [
                    "Keep your functions pure and modular",
                    "Use virtual environments (python -m venv .venv)",
                    "Explore FastAPI / Flask for production-ready APIs"
                ]
            }
            self.wfile.write(json.dumps(data).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

def run(server_class=HTTPServer, handler_class=FullstackAPIHandler, port=PORT):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"\n🐍 Python Fullstack API running at http://localhost:{port}/api/health")
    print(f"👤 Developed by @novalizerazizi\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == '__main__':
    run()
