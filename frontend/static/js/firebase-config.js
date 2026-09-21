// 1. Import the SDKs using the CDN links (necessary for browser-based JS)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. Your web app's Firebase configuration (Keep these exactly as they are)
const firebaseConfig = {
    apiKey: "AIzaSyBXUnT4yyYC99b8TmDQOC0WM-O7T5Qj218",
    authDomain: "smart-gram-95a83.firebaseapp.com",
    projectId: "smart-gram-95a83",
    storageBucket: "smart-gram-95a83.firebasestorage.app",
    messagingSenderId: "68140593567",
    appId: "1:68140593567:web:a5591580bf55ea39c98daa",
    measurementId: "G-PSYHZ7ZD6G"
};

// 3. Initialize Firebase
let app, db, auth;
try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("✅ Firebase initialized successfully");
    console.log("Project ID:", firebaseConfig.projectId);
} catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    console.error("Config:", firebaseConfig);
}

// 4. Initialize and EXPORT the services so other files can use them
// The "export" keyword is critical here!
export { db, auth };