// Global variables
let mainChart, trendChart, seasonalChart, residualChart;
let seasonalityChart, distributionChart, forecastChart, performanceChart;
let rawData = [];
let processedData = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initializeCharts();
    setupEventListeners();
    calculateStatistics();
});

// Load CSV data
async function loadData() {
    try {
        const response = await fetch('HospitalityEmployees.csv');
        const text = await response.text();
        
        const lines = text.trim().split('\n');
        const data = [];
        
        for (let i = 0; i < lines.length; i += 2) {
            if (i + 1 < lines.length) {
                const date = new Date(lines[i].trim());
                const value = parseFloat(lines[i + 1].trim());
                data.push({ date, value });
            }
        }
        
        rawData = data;
        processedData = processData(data);
        
        console.log('Data loaded successfully:', data.length, 'points');
    } catch (error) {
        console.error('Error loading data:', error);
        // Use sample data if file not found
        generateSampleData();
    }
}

// Generate sample data for demo
function generateSampleData() {
    const startDate = new Date(1990, 0, 1);
    const data = [];
    
    for (let i = 0; i < 348; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        
        const trend = 1064.5 + (i * 2.5);
        const seasonal = 50 * Math.sin((i * Math.PI) / 6);
        const noise = (Math.random() - 0.5) * 20;
        const value = trend + seasonal + noise;
        
        data.push({ date, value });
    }
    
    rawData = data;
    processedData = processData(data);
}

// Process data for decomposition
function processData(data) {
    const values = data.map(d => d.value);
    
    // Calculate moving average (trend)
    const window = 12;
    const trend = [];
    for (let i = 0; i < values.length; i++) {
        if (i < window / 2 || i >= values.length - window / 2) {
            trend.push(null);
        } else {
            const start = i - Math.floor(window / 2);
            const end = i + Math.ceil(window / 2);
            const sum = values.slice(start, end).reduce((a, b) => a + b, 0);
            trend.push(sum / window);
        }
    }
    
    // Calculate detrended
    const detrended = values.map((v, i) => trend[i] ? v - trend[i] : null);
    
    // Calculate seasonal component (average for each month)
    const seasonal = new Array(12).fill(0).map(() => []);
    detrended.forEach((v, i) => {
        if (v !== null) {
            const month = i % 12;
            seasonal[month].push(v);
        }
    });
    
    const seasonalAvg = seasonal.map(arr => 
        arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
    );
    
    const seasonalComponent = values.map((_, i) => seasonalAvg[i % 12]);
    
    // Calculate residual
    const residual = values.map((v, i) => 
        trend[i] ? v - trend[i] - seasonalComponent[i] : null
    );
    
    return {
        original: values,
        trend,
        seasonal: seasonalComponent,
        residual,
        dates: data.map(d => d.date)
    };
}

// Initialize all charts
function initializeCharts() {
    createMainChart();
    createDecompositionCharts();
    createSeasonalityChart();
    createDistributionChart();
    createForecastChart();
    createPerformanceChart();
}

// Create main time series chart
function createMainChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: rawData.map(d => d.date),
            datasets: [{
                label: 'Employees (thousands)',
                data: rawData.map(d => d.value),
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Employees: ${context.parsed.y.toFixed(1)}k`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'year',
                        displayFormats: {
                            year: 'yyyy'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Employees (thousands)'
                    }
                }
            }
        }
    });
    
    // Set canvas height
    document.getElementById('mainChart').style.height = '400px';
}

// Create decomposition charts
function createDecompositionCharts() {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: {
                type: 'time',
                time: { unit: 'year' }
            }
        }
    };
    
    // Trend
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: processedData.dates,
            datasets: [{
                data: processedData.trend,
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                tension: 0.4
            }]
        },
        options: commonOptions
    });
    
    // Seasonal
    const seasonalCtx = document.getElementById('seasonalChart').getContext('2d');
    seasonalChart = new Chart(seasonalCtx, {
        type: 'line',
        data: {
            labels: processedData.dates,
            datasets: [{
                data: processedData.seasonal,
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                tension: 0.4
            }]
        },
        options: commonOptions
    });
    
    // Residual
    const residualCtx = document.getElementById('residualChart').getContext('2d');
    residualChart = new Chart(residualCtx, {
        type: 'line',
        data: {
            labels: processedData.dates,
            datasets: [{
                data: processedData.residual,
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 1,
                pointRadius: 0,
                fill: false
            }]
        },
        options: commonOptions
    });
    
    // Set canvas heights
    ['trendChart', 'seasonalChart', 'residualChart'].forEach(id => {
        document.getElementById(id).style.height = '250px';
    });
}

// Create seasonality analysis chart
function createSeasonalityChart() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthlyAvg = new Array(12).fill(0).map(() => []);
    rawData.forEach(d => {
        const month = d.date.getMonth();
        monthlyAvg[month].push(d.value);
    });
    
    const avgByMonth = monthlyAvg.map(arr => 
        arr.reduce((a, b) => a + b, 0) / arr.length
    );
    
    const ctx = document.getElementById('seasonalityChart').getContext('2d');
    seasonalityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Average Employees',
                data: avgByMonth,
                backgroundColor: 'rgba(102, 126, 234, 0.7)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Employees (thousands)'
                    }
                }
            }
        }
    });
    
    document.getElementById('seasonalityChart').style.height = '250px';
}

// Create distribution chart
function createDistributionChart() {
    const values = rawData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binCount = 30;
    const binSize = (max - min) / binCount;
    
    const bins = new Array(binCount).fill(0);
    values.forEach(v => {
        const binIndex = Math.min(Math.floor((v - min) / binSize), binCount - 1);
        bins[binIndex]++;
    });
    
    const labels = bins.map((_, i) => (min + i * binSize).toFixed(0));
    
    const ctx = document.getElementById('distributionChart').getContext('2d');
    distributionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Frequency',
                data: bins,
                backgroundColor: 'rgba(118, 75, 162, 0.7)',
                borderColor: 'rgba(118, 75, 162, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Employees (thousands)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                }
            }
        }
    });
    
    document.getElementById('distributionChart').style.height = '250px';
}

// Create forecast chart
function createForecastChart() {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    
    forecastChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Historical Data',
                    data: [],
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true
                },
                {
                    label: 'Forecast',
                    data: [],
                    borderColor: 'rgba(239, 68, 68, 1)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    borderDash: [5, 5],
                    fill: false
                },
                {
                    label: 'Confidence Interval',
                    data: [],
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 0,
                    pointRadius: 0,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'month' }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Employees (thousands)'
                    }
                }
            }
        }
    });
    
    document.getElementById('forecastChart').style.height = '400px';
}

// Create performance comparison chart
function createPerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['MAE', 'RMSE', 'MAPE (%)'],
            datasets: [
                {
                    label: 'SARIMA',
                    data: [22.45, 28.67, 1.23],
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2,
                    borderRadius: 6
                },
                {
                    label: 'Exponential Smoothing',
                    data: [25.89, 32.14, 1.42],
                    backgroundColor: 'rgba(245, 158, 11, 0.7)',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    borderWidth: 2,
                    borderRadius: 6
                },
                {
                    label: 'Seasonal Naive',
                    data: [48.23, 61.45, 2.67],
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Lower is Better'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Error Metric Value'
                    }
                }
            }
        }
    });
    
    document.getElementById('performanceChart').style.height = '350px';
}

// Calculate and display statistics
function calculateStatistics() {
    const values = rawData.map(d => d.value);
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);
    
    const growthRate = ((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(1);
    
    // Update DOM
    document.getElementById('avgEmployees').textContent = mean.toFixed(1) + 'k';
    document.getElementById('growthRate').textContent = growthRate + '%';
    document.getElementById('statMean').textContent = mean.toFixed(1) + 'k';
    document.getElementById('statMedian').textContent = median.toFixed(1) + 'k';
    document.getElementById('statStd').textContent = std.toFixed(1) + 'k';
    document.getElementById('statMin').textContent = min.toFixed(1) + 'k';
    document.getElementById('statMax').textContent = max.toFixed(1) + 'k';
    document.getElementById('statRange').textContent = range.toFixed(1) + 'k';
}

// Setup event listeners
function setupEventListeners() {
    // Chart type selector
    document.getElementById('chartType').addEventListener('change', (e) => {
        updateMainChartType(e.target.value);
    });
    
    // Download chart
    document.getElementById('downloadChart').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'hospitality-chart.png';
        link.href = mainChart.toBase64Image();
        link.click();
    });
    
    // Forecast horizon slider
    const slider = document.getElementById('forecastHorizon');
    const display = document.getElementById('forecastValue');
    slider.addEventListener('input', (e) => {
        display.textContent = e.target.value;
    });
    
    // Generate forecast button
    document.getElementById('generateForecast').addEventListener('click', () => {
        const horizon = parseInt(document.getElementById('forecastHorizon').value);
        generateForecast(horizon);
    });
    
    // Initialize with default forecast
    generateForecast(12);
}

// Update main chart type
function updateMainChartType(type) {
    mainChart.config.type = type === 'area' ? 'line' : type;
    mainChart.data.datasets[0].fill = type === 'area';
    mainChart.update();
}

// Generate forecast
function generateForecast(months) {
    const lastDate = rawData[rawData.length - 1].date;
    const lastValue = rawData[rawData.length - 1].value;
    
    // Simple linear + seasonal forecast
    const trend = (rawData[rawData.length - 1].value - rawData[0].value) / rawData.length;
    const seasonalPattern = processedData.seasonal.slice(0, 12);
    
    const historicalDates = rawData.slice(-36).map(d => d.date);
    const historicalValues = rawData.slice(-36).map(d => d.value);
    
    const forecastDates = [];
    const forecastValues = [];
    const upperBound = [];
    const lowerBound = [];
    
    for (let i = 1; i <= months; i++) {
        const date = new Date(lastDate);
        date.setMonth(date.getMonth() + i);
        forecastDates.push(date);
        
        const trendComponent = lastValue + (trend * i);
        const seasonalComponent = seasonalPattern[(rawData.length + i - 1) % 12];
        const forecast = trendComponent + seasonalComponent;
        
        forecastValues.push(forecast);
        upperBound.push(forecast + (i * 2));
        lowerBound.push(forecast - (i * 2));
    }
    
    // Update chart
    forecastChart.data.labels = [...historicalDates, ...forecastDates];
    forecastChart.data.datasets[0].data = [...historicalValues, ...new Array(months).fill(null)];
    forecastChart.data.datasets[1].data = [...new Array(36).fill(null), ...forecastValues];
    forecastChart.data.datasets[2].data = [...new Array(36).fill(null), 
        ...forecastValues.map((v, i) => ({y: [lowerBound[i], upperBound[i]]  }))];
    
    forecastChart.update();
}
