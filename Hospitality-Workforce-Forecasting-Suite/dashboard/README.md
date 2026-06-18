# 🏨 Hospitality Workforce Analytics Dashboard

An interactive HTML/CSS/JavaScript dashboard for visualizing and analyzing the California Hospitality Industry employment time series data (1990-2018).

## 📋 Features

### 📊 Interactive Visualizations
- **Main Time Series Chart**: View employment trends with multiple chart types (Line, Area, Bar)
- **Decomposition Analysis**: Separate trend, seasonal, and residual components
- **Seasonality Analysis**: Monthly employment patterns visualization
- **Distribution Analysis**: Histogram showing data distribution
- **Forecast Visualization**: Generate and visualize future predictions with confidence intervals

### 🎯 Key Metrics Dashboard
- Total data points
- Average employees
- Growth rate over 28 years
- Time period summary

### 📈 Statistical Analysis
- Descriptive statistics (Mean, Median, Std Dev, Min, Max, Range)
- Seasonal patterns by month
- Data distribution visualization

### 🔮 Forecasting
- Interactive forecast generation
- Adjustable forecast horizon (1-24 months)
- Confidence intervals visualization
- SARIMA-based predictions

### 🏆 Model Performance Comparison
- SARIMA model metrics
- Exponential Smoothing results
- Seasonal Naive baseline
- Visual comparison of MAE, RMSE, and MAPE

### 💡 Business Insights
- Key findings and trends
- Seasonal pattern analysis
- Recommendations for business planning

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No server installation required (runs locally)

### Installation

1. **Navigate to the dashboard folder**:
   ```bash
   cd "Hospitality-Workforce-Forecasting-Suite/dashboard"
   ```

2. **Open the dashboard**:
   - Double-click `index.html` to open in your default browser
   - Or right-click and select "Open with" your preferred browser

### Alternative: Using a Local Server

For better performance and to avoid CORS issues, you can use a local server:

#### Option 1: Using Python
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

#### Option 2: Using Node.js
```bash
npx http-server -p 8000

# Then open: http://localhost:8000
```

#### Option 3: Using VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 📂 Project Structure

```
dashboard/
├── index.html          # Main dashboard HTML
├── styles.css          # Dashboard styling
├── script.js           # JavaScript logic and Chart.js visualizations
└── README.md          # This file

Dataset/
└── HospitalityEmployees.csv  # Time series data
```

## 🎨 Features in Detail

### 1. **Main Chart**
- Switch between Line, Area, and Bar chart types
- Zoom and pan functionality
- Download chart as PNG image
- Responsive tooltips showing exact values

### 2. **Time Series Decomposition**
- **Trend**: Long-term movement pattern
- **Seasonal**: Repeating patterns within a year
- **Residual**: Random variations after removing trend and seasonality

### 3. **Interactive Forecast**
- Adjust forecast horizon using slider (1-24 months)
- Click "Generate Forecast" to update predictions
- View confidence intervals as shaded areas
- Based on SARIMA modeling approach

### 4. **Performance Metrics**
- **MAE (Mean Absolute Error)**: Average prediction error
- **RMSE (Root Mean Square Error)**: Penalizes larger errors more
- **MAPE (Mean Absolute Percentage Error)**: Error as percentage
- Compare multiple forecasting models

### 5. **Responsive Design**
- Works on desktop, tablet, and mobile devices
- Automatically adjusts layout for different screen sizes
- Touch-friendly controls

## 📊 Understanding the Data

### Dataset Information
- **Region**: California, United States
- **Industry**: Hospitality & Tourism
- **Metric**: Number of employees (in thousands)
- **Frequency**: Monthly averages
- **Time Period**: January 1990 – December 2018
- **Total Observations**: 348 data points

### Key Patterns
1. **Upward Trend**: Employment grew from ~1,064k (1990) to ~1,925k (2018)
2. **Seasonal Pattern**: Summer peaks (June-August), winter lows (January-February)
3. **Growth Rate**: 81% increase over 28 years
4. **Economic Cycles**: Reflects broader economic trends and recessions

## 🔧 Customization

### Changing Chart Colors
Edit `script.js` and modify the color values:
```javascript
borderColor: 'rgba(102, 126, 234, 1)',  // Line color
backgroundColor: 'rgba(102, 126, 234, 0.1)',  // Fill color
```

### Adjusting Chart Heights
Edit `styles.css` and modify the height values or add inline styles in `script.js`:
```javascript
document.getElementById('mainChart').style.height = '400px';
```

### Adding New Metrics
1. Add HTML element in `index.html`
2. Calculate metric in `calculateStatistics()` function in `script.js`
3. Update DOM element with new value

## 📱 Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 🐛 Troubleshooting

### Data Not Loading
- Ensure `HospitalityEmployees.csv` is in the correct location (`../Dataset/`)
- Check browser console for error messages
- Try using a local server instead of opening file directly

### Charts Not Displaying
- Clear browser cache and reload
- Check if JavaScript is enabled
- Ensure Chart.js CDN is accessible

### Responsive Issues
- Try different browser
- Clear cache and reload
- Check zoom level (should be 100%)

## 📚 Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling with gradients, animations, and flexbox/grid
- **JavaScript (ES6+)**: Interactive functionality
- **Chart.js**: Data visualization library
- **date-fns**: Date handling for Chart.js

## 🤝 Contributing

To contribute to this dashboard:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available for educational and commercial use.

## 👨‍💻 Author

**Sajjad Ali Shah**
- LinkedIn: [sajjad-ali-shah47](https://www.linkedin.com/in/sajjad-ali-shah47/)

## 🙏 Acknowledgments

- Dataset source: California Employment Development Department
- Chart.js library for excellent visualization capabilities
- Time series analysis techniques from statistical literature

## 📞 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Contact via LinkedIn for additional support

---

**Enjoy exploring the Hospitality Employees Time Series Dashboard! 📊✨**
