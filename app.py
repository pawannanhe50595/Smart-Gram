import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend.app import app

if __name__ == '__main__':
    print("Starting SmartGram Server via root app.py...")
    app.run(host='0.0.0.0', port=5002, debug=True)
