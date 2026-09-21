# 🔧 SmartGram Firebase Setup Guide

## Problem Identified ✅
- Firebase not showing villages in the selector dropdown
- Firestore database is likely empty (no villages collection data)
- Missing error messages for debugging

## Solution Overview 
We've added **better error handling** and created tools to populate your database.

---

## ✅ Step 1: Install Firebase Admin SDK

```bash
pip install -r requirements.txt
```

---

## ✅ Step 2: Get Your Firebase Service Account Key

You need a **Service Account Key** to initialize Firestore from Python:

1. **Open Firebase Console:**
   - Go to: https://console.firebase.google.com/
   - Select: `smart-gram-95a83` project

2. **Navigate to Service Account:**
   - Click ⚙️ Settings (top-left corner)
   - Click **"Service Accounts"** tab
   - Click **"Generate New Private Key"**
   - Save the JSON file

3. **Place the Key:**
   - Save the file as: `backend/serviceAccountKey.json`
   - **IMPORTANT:** Never commit this file to Git (already in `.gitignore`)

---

## ✅ Step 3: Populate Firestore with Sample Villages

```bash
python backend/init_firestore.py
```

Expected output:
```
✅ Connected to Firestore
✅ Uploaded: Nagazari (ID: nagazari)
✅ Uploaded: Ahmednagar (ID: ahmednagar)
✅ Uploaded: Manjara (ID: manjara)
✅ Uploaded: Phaltan (ID: phaltan)
✅ Uploaded: Indapur (ID: indapur)

✅ Successfully uploaded 5 villages to Firestore!
   You can now see them in your Dashboard
```

---

## ✅ Step 4: Test the Firebase Connection

1. **Start your Flask server:**
   ```bash
   python app.py
   ```

2. **Open diagnostic page:**
   - http://localhost:5002/firebase-test.html

3. **Run all tests** (click each button):
   - ✅ Firebase modules should load
   - ✅ Configuration should be valid
   - ✅ Firebase should initialize
   - ✅ Firestore should connect
   - ✅ Should see 5 villages listed
   - ✅ Network should be accessible

---

## ✅ Step 5: Test the Dashboard

1. **Open dashboard:** http://localhost:5002/dashboard.html
2. **Login with Google** (if you want to test auth)
3. **Village Selector** should now show:
   - Nagazari
   - Ahmednagar
   - Manjara
   - Phaltan
   - Indapur

4. **Select a village** to see the digital twin and charts

---

## 🐛 Troubleshooting

### Issue: "No villages found in database"
- **Solution:** Run `python backend/init_firestore.py` again
- **Check:** Go to Firebase Console > Firestore > Collections > Villages

### Issue: "Error loading villages" (Firebase error)
- **Check:** Is `serviceAccountKey.json` in the backend folder?
- **Check:** Is the API key correct?
- **Check:** Does the Firebase project have Firestore enabled?

### Issue: Script can't connect to Firestore
- **Cause:** Service account key is missing or invalid
- **Solution:** Download fresh key from Firebase Console

### Issue: "Error loading Firebase modules"
- **Cause:** Network issue or blocked CDN
- **Solution:** Check internet connection and browser network settings

---

## 📝 Village Data Structure

Each village has this structure in Firestore:

```javascript
{
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
}
```

---

## 🚀 Quick Reference Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Initialize Firestore data
python backend/init_firestore.py

# Run Flask server
python app.py

# Diagnostic Page: http://localhost:5002/firebase-test.html
# Dashboard:       http://localhost:5002/dashboard.html
```
