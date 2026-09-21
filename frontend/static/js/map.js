/**
 * SmartGram Map Module
 * Handles Leaflet.js map initialization and village markers
 */

let map;
let markersLayer;
let villageMarkers = {};

/**
 * Initialize the Leaflet map
 * Creates map center in India (NCR region)
 */
async function initializeMap() {
    try {
        // Initialize map centered on Delhi/NCR region
        map = L.map('map').setView([28.6139, 77.2090], 10);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            minZoom: 8
        }).addTo(map);

        // Create markers layer
        markersLayer = L.layerGroup().addTo(map);

        // Load and display villages
        await loadVillageMarkers();

        console.log('✓ Map initialized successfully');
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

/**
 * Load all villages and create markers on map
 */
async function loadVillageMarkers() {
    try {
        const response = await fetch('/api/villages');
        const data = await response.json();

        if (data.status === 'success') {
            const villages = data.data;

            villages.forEach(village => {
                createVillageMarker(village);
            });

            // Fit map bounds to show all markers
            if (Object.keys(villageMarkers).length > 0) {
                const group = new L.featureGroup(Object.values(villageMarkers));
                map.fitBounds(group.getBounds().pad(0.1));
            }
        }
    } catch (error) {
        console.error('Error loading village markers:', error);
    }
}

/**
 * Create a marker for a village on the map
 * 
 * @param {Object} village - Village data object
 */
function createVillageMarker(village) {
    const { id, name, latitude, longitude, population, literacy_rate, water_access_pct, electricity_access_pct } = village;

    // Determine marker color based on development index
    const devIndex = (literacy_rate * 0.3) + (water_access_pct * 0.3) + ((100 - village.poverty_rate) * 0.2) + (electricity_access_pct * 0.2);
    const markerColor = getMarkerColor(devIndex);

    // Create custom icon
    const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${markerColor}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
                    <i class="fas fa-map-pin" style="font-size: 14px;"></i>
               </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    // Create marker
    const marker = L.marker([latitude, longitude], { icon: markerIcon });

    // Create popup content
    const popupContent = createPopupContent(village);
    marker.bindPopup(popupContent, { maxWidth: 350 });

    // Add click event to show village details
    marker.on('click', function() {
        highlightVillage(id);
    });

    // Add to markers layer
    marker.addTo(markersLayer);
    villageMarkers[id] = marker;
}

/**
 * Get marker color based on development index
 * 
 * @param {number} devIndex - Development index (0-100)
 * @returns {string} - Hex color code
 */
function getMarkerColor(devIndex) {
    if (devIndex >= 70) return '#4CAF50';      // Green - Good development
    if (devIndex >= 50) return '#FFC107';      // Yellow - Medium development
    if (devIndex >= 30) return '#FF9800';      // Orange - Low development
    return '#F44336';                          // Red - Critical development
}

/**
 * Create HTML content for village marker popup
 * 
 * @param {Object} village - Village data
 * @returns {string} - HTML popup content
 */
function createPopupContent(village) {
    const { name, population, literacy_rate, water_access_pct, electricity_access_pct, poverty_rate, school_count, hospital_count } = village;

    return `
        <div class="village-popup">
            <h3 style="margin: 0 0 10px 0; color: #2E7D32;">${name}</h3>
            
            <div class="popup-section">
                <strong>Demographics</strong>
                <div class="popup-item">
                    <span>Population:</span>
                    <span style="font-weight: bold;">${population.toLocaleString()}</span>
                </div>
                <div class="popup-item">
                    <span>Poverty Rate:</span>
                    <span style="font-weight: bold;">${poverty_rate.toFixed(1)}%</span>
                </div>
            </div>

            <div class="popup-section">
                <strong>Infrastructure</strong>
                <div class="popup-item">
                    <span>Literacy Rate:</span>
                    <span style="font-weight: bold;">${literacy_rate.toFixed(1)}%</span>
                </div>
                <div class="popup-item">
                    <span>Water Access:</span>
                    <span style="font-weight: bold;">${water_access_pct.toFixed(1)}%</span>
                </div>
                <div class="popup-item">
                    <span>Electricity:</span>
                    <span style="font-weight: bold;">${electricity_access_pct.toFixed(1)}%</span>
                </div>
            </div>

            <div class="popup-section">
                <strong>Facilities</strong>
                <div class="popup-item">
                    <span>Schools:</span>
                    <span style="font-weight: bold;">${school_count}</span>
                </div>
                <div class="popup-item">
                    <span>Hospitals:</span>
                    <span style="font-weight: bold;">${hospital_count}</span>
                </div>
            </div>
            
            ${village.house_count ? `
            <div class="popup-section">
                <strong>Micro-Level Data</strong>
                <div class="popup-item">
                    <span>Total Houses:</span>
                    <span style="font-weight: bold;">${village.house_count}</span>
                </div>
                <div class="popup-item">
                    <span>Main Crops:</span>
                    <span style="font-weight: bold;">${village.main_crops ? village.main_crops.join(', ') : 'N/A'}</span>
                </div>
                <div class="popup-item">
                    <span>Water Tanks:</span>
                    <span style="font-weight: bold;">${village.water_storage ? village.water_storage.tanks : '0'}</span>
                </div>
            </div>
            ` : ''}

            <button onclick="showVillageDetails(${village.id})" 
                    style="width: 100%; margin-top: 10px; padding: 8px; background-color: #2E7D32; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
                View Full Details
            </button>
        </div>
        <style>
            .village-popup {
                font-size: 12px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            .popup-section {
                margin: 8px 0;
                padding: 8px;
                background-color: #f5f5f5;
                border-radius: 4px;
            }
            .popup-section strong {
                color: #1B5E20;
                display: block;
                margin-bottom: 5px;
            }
            .popup-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
            }
            .popup-item:last-child {
                margin-bottom: 0;
            }
        </style>
    `;
}

/**
 * Highlight a village on the map
 * 
 * @param {number} villageId - ID of village to highlight
 */
function highlightVillage(villageId) {
    // Reset all markers
    Object.values(villageMarkers).forEach(marker => {
        marker.setOpacity(0.7);
    });

    // Highlight selected village
    if (villageMarkers[villageId]) {
        villageMarkers[villageId].setOpacity(1);
        map.flyTo(villageMarkers[villageId].getLatLng(), 12, {
            duration: 1
        });
    }
}

/**
 * Show detailed village information
 * (Can be extended to show a modal or sidebar with detailed data)
 * 
 * @param {number} villageId - ID of village
 */
function showVillageDetails(villageId) {
    // Highlight on map
    highlightVillage(villageId);
    
    // Select in dropdown if present
    const villageFilter = document.getElementById('village-filter');
    if (villageFilter) {
        villageFilter.value = villageId;
        villageFilter.dispatchEvent(new Event('change'));
    }

    // Scroll to dashboard if available
    const predictionVillage = document.getElementById('prediction-village');
    if (predictionVillage) {
        predictionVillage.value = villageId;
        predictionVillage.dispatchEvent(new Event('change'));
        predictionVillage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Update map view to specific coordinates
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} zoom - Zoom level (optional, default 12)
 */
function updateMapView(lat, lng, zoom = 12) {
    if (map) {
        map.flyTo([lat, lng], zoom, { duration: 1 });
    }
}

/**
 * Clear all markers from map
 */
function clearMarkers() {
    markersLayer.clearLayers();
    villageMarkers = {};
}

/**
 * Refresh map with updated data
 */
async function refreshMapData() {
    clearMarkers();
    await loadVillageMarkers();
}

// Export functions for global access
window.highlightVillage = highlightVillage;
window.showVillageDetails = showVillageDetails;
window.updateMapView = updateMapView;
window.initializeMap = initializeMap;
