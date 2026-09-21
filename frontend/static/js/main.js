/**
 * SmartGram Main Module
 * Integrated with Firebase Firestore & Auth
 */

// 1. IMPORT FIREBASE SERVICES
// Ensure these match your export names in firebase-config.js
import { db, auth } from './firebase-config.js';
import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const API_BASE_URL = (window.location.origin && window.location.origin !== 'null')
    ? window.location.origin
    : 'http://127.0.0.1:5002';

// ==================== FIREBASE DATA LOGIC ====================

/**
 * Specifically fetch and display Nagazari village data 
 * Based on your Firestore screenshot
 */
async function loadNagazariDashboard() {
    // Note: Collection is "Villages" (Capital V) per your screenshot
    const docRef = doc(db, "Villages", "nagazari");

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Nagazari Data Fetched:", data);

            // Update UI Elements by ID
            // --- Basic Fields ---
            if (document.getElementById('v-name')) document.getElementById('v-name').innerText = data.name;
            if (document.getElementById('v-area')) document.getElementById('v-area').innerText = data.totalArea; // "28800 aq meter"
            if (document.getElementById('v-pop')) document.getElementById('v-pop').innerText = data.population;
            if (document.getElementById('v-houses')) document.getElementById('v-houses').innerText = data.houses;

            // --- Map/Object Fields ---
            // "Power Supply" has a space, so we use bracket notation
            const power = data['Power Supply'];
            if (power && document.getElementById('v-power')) {
                document.getElementById('v-power').innerText = `Domestic: ${power.domestic}, Agri: ${power.agricultural}`;
            }

            const water = data.WaterSupply;
            if (water && document.getElementById('v-water')) {
                document.getElementById('v-water').innerText = `Borewell: ${water.boreWell}, Well: ${water.well}, Lake: ${water.lake}`;
            }

            // --- Array Fields ---
            if (document.getElementById('v-crops') && data.mainCrops) {
                document.getElementById('v-crops').innerText = data.mainCrops.join(", ");
            }

            if (document.getElementById('v-tanks') && data.Tanks) {
                document.getElementById('v-tanks').innerText = data.Tanks.join(" & ");
            }

            // --- Facility Indicators ---
            if (document.getElementById('v-bank'))
                document.getElementById('v-bank').innerText = data.bank > 0 ? "Available" : "No Bank";

            if (document.getElementById('v-hall'))
                document.getElementById('v-hall').innerText = data.communityHall > 0 ? "Yes" : "No";

            showNotification("Nagazari data updated from cloud", "success");
        } else {
            console.warn("Village 'nagazari' not found in collection 'Villages'");
        }
    } catch (error) {
        console.error("Firebase Error:", error);
        showNotification("Error loading dashboard data", "error");
    }
}

/**
 * Google Login Handler
 */
async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        showNotification(`Welcome ${result.user.displayName}`, "success");
        window.location.href = "/dashboard"; // Navigate to dashboard
    } catch (error) {
        console.error("Login Error:", error);
        showNotification("Google Login Failed", "error");
    }
}

// ==================== UTILITY FUNCTIONS ====================

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 15px 20px;
        background-color: ${getNotificationColor(type)}; color: white;
        border-radius: 5px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999; font-weight: 500; animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function getNotificationColor(type) {
    const colors = { 'success': '#4CAF50', 'error': '#F44336', 'warning': '#FF9800', 'info': '#2196F3' };
    return colors[type] || colors['info'];
}

// ==================== INITIALIZATION & EVENTS ====================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar / Hamburger Logic
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // 2. Auth Status Listener
    onAuthStateChanged(auth, (user) => {
        const authLinks = document.querySelectorAll('.auth-link');
        if (user) {
            // Logged In
            authLinks.forEach(link => {
                link.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout (${user.displayName.split(' ')[0]})`;
                link.href = "#";
                link.onclick = (e) => { e.preventDefault(); signOut(auth); };
            });

            // If on dashboard, load Nagazari data
            if (window.location.pathname.includes('dashboard')) {
                loadNagazariDashboard();
            }
        } else {
            // Logged Out
            authLinks.forEach(link => {
                link.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
                link.href = '/login';
                link.onclick = null;
            });
        }
    });

    // 3. Bind Login Button
    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', loginWithGoogle);
    }
});

// ==================== GLOBAL EXPORTS ====================
window.formatNumber = formatNumber;
window.showNotification = showNotification;
window.loadNagazariDashboard = loadNagazariDashboard;