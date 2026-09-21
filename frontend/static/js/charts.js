/**
 * SmartGram Charts Module
 * Handles Chart.js visualizations for dashboard
 */

let charts = {};

/**
 * Load all dashboard charts
 */
async function loadAllCharts() {
    try {
        const response = await fetch('/api/villages');
        const data = await response.json();

        if (data.status === 'success') {
            const villages = data.data;
            
            // Initialize all charts
            createLiteracyChart(villages);
            createPopulationChart(villages);
            createInfrastructureChart(villages);
            createPovertyChart(villages);

            console.log('✓ All charts loaded successfully');
        }
    } catch (error) {
        console.error('Error loading charts:', error);
    }
}

/**
 * Create Literacy Rates Bar Chart
 * 
 * @param {Array} villages - Array of village objects
 */
function createLiteracyChart(villages) {
    const ctx = document.getElementById('literacyChart');
    if (!ctx) return;

    const chartData = {
        labels: villages.map(v => v.name),
        datasets: [{
            label: 'Literacy Rate (%)',
            data: villages.map(v => v.literacy_rate),
            backgroundColor: [
                '#4CAF50',
                '#81C784',
                '#AED581',
                '#FDD835',
                '#FB8C00',
                '#F4511E',
                '#E64A19',
                '#C62828'
            ],
            borderColor: '#2E7D32',
            borderWidth: 2,
            borderRadius: 5
        }]
    };

    if (charts['literacy']) {
        charts['literacy'].destroy();
    }

    charts['literacy'] = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltips: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.x.toFixed(1) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Population Distribution Pie Chart
 * 
 * @param {Array} villages - Array of village objects
 */
function createPopulationChart(villages) {
    const ctx = document.getElementById('populationChart');
    if (!ctx) return;

    // Calculate total population for percentages
    const totalPop = villages.reduce((sum, v) => sum + v.population, 0);

    const chartData = {
        labels: villages.map(v => v.name),
        datasets: [{
            data: villages.map(v => ((v.population / totalPop) * 100)),
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FF6384',
                '#C9CBCF'
            ],
            borderColor: '#fff',
            borderWidth: 2
        }]
    };

    if (charts['population']) {
        charts['population'].destroy();
    }

    charts['population'] = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const villageIndex = context.dataIndex;
                            const population = villages[villageIndex].population;
                            return `${label}: ${value.toFixed(1)}% (${population.toLocaleString()})`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Infrastructure Access Comparison Bar Chart
 * 
 * @param {Array} villages - Array of village objects
 */
function createInfrastructureChart(villages) {
    const ctx = document.getElementById('infrastructureChart');
    if (!ctx) return;

    const chartData = {
        labels: villages.map(v => v.name),
        datasets: [
            {
                label: 'Water Access (%)',
                data: villages.map(v => v.water_access_pct),
                backgroundColor: '#03A9F4',
                borderColor: '#0277BD',
                borderWidth: 1
            },
            {
                label: 'Electricity Access (%)',
                data: villages.map(v => v.electricity_access_pct),
                backgroundColor: '#FFC107',
                borderColor: '#FFA000',
                borderWidth: 1
            }
        ]
    };

    if (charts['infrastructure']) {
        charts['infrastructure'].destroy();
    }

    charts['infrastructure'] = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Poverty Rate Comparison Chart
 * 
 * @param {Array} villages - Array of village objects
 */
function createPovertyChart(villages) {
    const ctx = document.getElementById('povertyChart');
    if (!ctx) return;

    const chartData = {
        labels: villages.map(v => v.name),
        datasets: [{
            label: 'Poverty Rate (%)',
            data: villages.map(v => v.poverty_rate),
            backgroundColor: '#EF5350',
            borderColor: '#C62828',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#C62828',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
        }]
    };

    if (charts['poverty']) {
        charts['poverty'].destroy();
    }

    charts['poverty'] = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create a custom chart with specified data
 * 
 * @param {string} chartId - ID of canvas element
 * @param {string} type - Chart type (bar, line, pie, etc.)
 * @param {Object} data - Chart data object
 * @param {Object} options - Chart.js options
 */
function createCustomChart(chartId, type, data, options = {}) {
    const ctx = document.getElementById(chartId);
    if (!ctx) return null;

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top'
            }
        }
    };

    const mergedOptions = { ...defaultOptions, ...options };

    // Destroy existing chart if it exists
    if (charts[chartId]) {
        charts[chartId].destroy();
    }

    charts[chartId] = new Chart(ctx, {
        type: type,
        data: data,
        options: mergedOptions
    });

    return charts[chartId];
}

/**
 * Update chart data
 * 
 * @param {string} chartId - Chart identifier
 * @param {Array} newLabels - New labels for chart
 * @param {Array} newData - New data for chart
 */
function updateChartData(chartId, newLabels, newData) {
    if (charts[chartId]) {
        charts[chartId].data.labels = newLabels;
        charts[chartId].data.datasets[0].data = newData;
        charts[chartId].update();
    }
}

/**
 * Destroy all charts (cleanup function)
 */
function destroyAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    charts = {};
}

/**
 * Render Advanced Village Deep-Dive Charts
 */
function renderDeepDive(village) {
    const section = document.getElementById('deep-dive-section');
    if (!village || !village.house_count) {
        if (section) section.style.display = 'none';
        return;
    }
    
    // Show section
    if (section) section.style.display = 'block';
    
    // 1. Water Sources Pie Chart
    const wsCtx = document.getElementById('waterSourcesChart');
    if (wsCtx) {
        if (charts['waterSources']) charts['waterSources'].destroy();
        
        const sources = village.water_sources || {};
        charts['waterSources'] = new Chart(wsCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(sources).map(k => k.replace('_', ' ').toUpperCase()),
                datasets: [{
                    data: Object.values(sources),
                    backgroundColor: ['#4BC0C0', '#36A2EB', '#9966FF'],
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // 2. Power Supply Bar Chart
    const psCtx = document.getElementById('powerSupplyChart');
    if (psCtx) {
        if (charts['powerSupply']) charts['powerSupply'].destroy();
        
        const power = village.power_supply || {};
        charts['powerSupply'] = new Chart(psCtx, {
            type: 'bar',
            data: {
                labels: ['Domestic', 'Agriculture'],
                datasets: [{
                    label: 'Hours / Day',
                    data: [power.domestic_hrs || 0, power.agriculture_hrs || 0],
                    backgroundColor: ['#FFC107', '#FF9800']
                }]
            },
            options: { 
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, max: 24 } }
            }
        });
    }

    // 3. Dynamic Stats rendering
    const statsContainer = document.getElementById('deep-dive-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="resource-item">
                <h4>Main Crops</h4>
                <p>${village.main_crops ? village.main_crops.join(', ') : 'N/A'}</p>
            </div>
            <div class="resource-item">
                <h4>Income Sources</h4>
                <p>${village.income_sources ? village.income_sources.join(', ') : 'N/A'}</p>
            </div>
            <div class="resource-item">
                <h4>Water Capacity</h4>
                <p>${village.water_storage ? village.water_storage.capacity_liters.toLocaleString() + ' Liters' : 'N/A'}</p>
            </div>
            <div class="resource-item">
                <h4>Total Houses</h4>
                <p>${village.house_count}</p>
            </div>
        `;
    }
}

// Export functions for global access
window.createLiteracyChart = createLiteracyChart;
window.createPopulationChart = createPopulationChart;
window.createInfrastructureChart = createInfrastructureChart;
window.createCustomChart = createCustomChart;
window.updateChartData = updateChartData;
window.loadAllCharts = loadAllCharts;
window.destroyAllCharts = destroyAllCharts;
window.renderDeepDive = renderDeepDive;
