import importlib.util
import os
import pkgutil
import types

# --- CRITICAL FIX FOR PYTHON 3.14 ---
if not hasattr(pkgutil, 'get_loader'):
    def get_loader(name):
        if isinstance(name, types.ModuleType): name = name.__name__
        if name == '__main__': return None
        spec = importlib.util.find_spec(name)
        return spec.loader if spec is not None else None
    pkgutil.get_loader = get_loader

from flask import Flask, jsonify, render_template, abort, request, redirect, url_for
from flask_cors import CORS

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')

app = Flask(
    __name__,
    template_folder=os.path.join(FRONTEND_DIR, 'templates'),
    static_folder=os.path.join(FRONTEND_DIR, 'static'),
    static_url_path='/static'
)
CORS(app)

# Sample village data (fallback for when Firebase is not available)
VILLAGES_DB = {
    "nagazari": {
        "name": "Nagazari",
        "population": 8500,
        "totalArea": "28800 sq meter",
        "houses": 1200,
        "mainCrops": ["Sugarcane", "Cotton", "Jowar"],
        "IncomesSources": ["Agriculture", "Sugar Mill", "Dairy"],
        "communityHall": 1,
        "healthFacility": 1,
        "bank": 1,
        "WaterSupply": {
            "boreWell": 45,
            "well": 12,
            "lake": 1,
            "own": 2
        },
        "Power Supply": {
            "agricultural": "8 hours",
            "domestic": "24 hours"
        },
        "Tanks": ["Navapur Tank", "Mutha Tank"],
        "location": "[21.08266, 78.60331]"
    },
    "ahmednagar": {
        "name": "Ahmednagar",
        "population": 12000,
        "totalArea": "35000 sq meter",
        "houses": 1800,
        "mainCrops": ["Wheat", "Cotton", "Onion"],
        "IncomesSources": ["Agriculture", "Trade", "Services"],
        "communityHall": 1,
        "healthFacility": 2,
        "bank": 2,
        "WaterSupply": {
            "boreWell": 60,
            "well": 20,
            "lake": 2,
            "own": 5
        },
        "Power Supply": {
            "agricultural": "10 hours",
            "domestic": "24 hours"
        },
        "Tanks": ["Ahmednagar Tank", "Mula Tank"],
        "location": "[19.0919, 75.3235]"
    },
    "manjara": {
        "name": "Manjara",
        "population": 5200,
        "totalArea": "18000 sq meter",
        "houses": 750,
        "mainCrops": ["Rice", "Sugarcane", "Maize"],
        "IncomesSources": ["Agriculture", "Animal Husbandry"],
        "communityHall": 1,
        "healthFacility": 1,
        "bank": 0,
        "WaterSupply": {
            "boreWell": 25,
            "well": 8,
            "lake": 1,
            "own": 1
        },
        "Power Supply": {
            "agricultural": "6 hours",
            "domestic": "20 hours"
        },
        "Tanks": ["Manjara Tank"],
        "location": "[19.4, 75.5]"
    },
    "phaltan": {
        "name": "Phaltan",
        "population": 9800,
        "totalArea": "32000 sq meter",
        "houses": 1400,
        "mainCrops": ["Sugarcane", "Jowar", "Gram"],
        "IncomesSources": ["Agriculture", "Sugar Factory", "Petty Trade"],
        "communityHall": 2,
        "healthFacility": 2,
        "bank": 1,
        "WaterSupply": {
            "boreWell": 50,
            "well": 15,
            "lake": 0,
            "own": 3
        },
        "Power Supply": {
            "agricultural": "9 hours",
            "domestic": "22 hours"
        },
        "Tanks": ["Phaltan Tank", "Bhima Tank"],
        "location": "[18.0, 74.8]"
    },
    "indapur": {
        "name": "Indapur",
        "population": 15000,
        "totalArea": "45000 sq meter",
        "houses": 2200,
        "mainCrops": ["Sugarcane", "Cotton", "Wheat"],
        "IncomesSources": ["Agriculture", "Food Processing", "Commerce"],
        "communityHall": 2,
        "healthFacility": 3,
        "bank": 2,
        "WaterSupply": {
            "boreWell": 80,
            "well": 25,
            "lake": 2,
            "own": 8
        },
        "Power Supply": {
            "agricultural": "12 hours",
            "domestic": "24 hours"
        },
        "Tanks": ["Indapur Tank", "Bhima Left Bank Canal"],
        "location": "[18.74, 75.49]"
    }
}

# API Endpoints
@app.route('/api/villages', methods=['GET'])
def get_villages():
    """Get all villages"""
    return jsonify({
        "villages": [
            {"id": vid, "name": data["name"]} 
            for vid, data in VILLAGES_DB.items()
        ]
    })

@app.route('/api/villages/<village_id>', methods=['GET'])
def get_village(village_id):
    """Get a specific village by ID"""
    if village_id in VILLAGES_DB:
        return jsonify(VILLAGES_DB[village_id])
    return jsonify({"error": "Village not found"}), 404

# Web Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/<page>.html', methods=['GET', 'POST'])
def render_html(page):
    try:
        return render_template(f'{page}.html')
    except Exception:
        abort(404)

if __name__ == '__main__':
    print('SmartGram Server starting on http://localhost:5002')
    app.run(host='0.0.0.0', port=5002, debug=True)