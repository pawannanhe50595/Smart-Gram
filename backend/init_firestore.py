#!/usr/bin/env python3
"""
SmartGram Firebase Firestore Data Initialization Script
Populates the Firestore database with sample village data
"""

import firebase_admin
from firebase_admin import credentials, firestore
import json
import sys

# Initialize Firebase
try:
    # Option 1: Use service account key (if you have it)
    # cred = credentials.Certificate('path/to/serviceAccountKey.json')
    # firebase_admin.initialize_app(cred)
    
    # Option 2: Use default credentials (if running on GCP)
    firebase_admin.initialize_app()
    db = firestore.client()
    print("✅ Connected to Firestore")
except Exception as e:
    print(f"❌ Error connecting to Firestore: {e}")
    print("\n⚠️  To use this script, you need to:")
    print("1. Download your Firebase service account key from Firebase Console")
    print("2. Save it as 'serviceAccountKey.json' in the backend folder")
    print("3. Uncomment the 'Option 1' code above and run this script again")
    sys.exit(1)

# Sample village data
VILLAGES = [
    {
        "id": "nagazari",
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
        "location": "[21.08266, 78.60331]",
        "description": "A progressive village in Maharashtra with strong agricultural base"
    },
    {
        "id": "ahmednagar",
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
        "location": "[19.0919, 75.3235]",
        "description": "Major agricultural hub in Ahmednagar district"
    },
    {
        "id": "manjara",
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
        "location": "[19.4, 75.5]",
        "description": "Developing village with focus on sustainable farming"
    },
    {
        "id": "phaltan",
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
        "location": "[18.0, 74.8]",
        "description": "Industrial and agricultural village in Satara district"
    },
    {
        "id": "indapur",
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
        "location": "[18.74, 75.49]",
        "description": "Large developed village with strong infrastructure"
    }
]

def upload_villages():
    """Upload village data to Firestore"""
    try:
        for village in VILLAGES:
            village_id = village.pop("id")
            db.collection("Villages").document(village_id).set(village)
            print(f"✅ Uploaded: {village['name']} (ID: {village_id})")
        
        print(f"\n✅ Successfully uploaded {len(VILLAGES)} villages to Firestore!")
        print("   You can now see them in your Dashboard")
        
    except Exception as e:
        print(f"❌ Error uploading villages: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("🚀 SmartGram Firebase Data Initialization")
    print("=" * 50)
    upload_villages()
