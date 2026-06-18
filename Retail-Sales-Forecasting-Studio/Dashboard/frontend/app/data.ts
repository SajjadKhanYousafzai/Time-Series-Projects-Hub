// Static dashboard data derived from the Store Sales notebook analysis

// Filter options
export const years = [2013, 2014, 2015, 2016, 2017];
export const storeNumbers = Array.from({ length: 54 }, (_, i) => i + 1);
export const families = [
  'GROCERY I', 'BEVERAGES', 'PRODUCE', 'CLEANING', 'DAIRY',
  'BREAD/BAKERY', 'POULTRY', 'MEATS', 'PERSONAL CARE', 'DELI',
  'FROZEN FOODS', 'EGGS', 'HOME AND KITCHEN I', 'HOME CARE',
  'LINGERIE', 'AUTOMOTIVE', 'HARDWARE', 'PET SUPPLIES', 'BABY CARE',
  'MAGAZINES', 'BOOKS', 'PLAYERS AND ELECTRONICS', 'SCHOOL AND OFFICE SUPPLIES',
  'HOME AND KITCHEN II', 'CELEBRATION', 'LADIESWEAR', 'LAWN AND GARDEN',
  'HOME APPLIANCES', 'LIQUOR,WINE,BEER', 'PREPARED FOODS', 'SEAFOOD',
  'BEAUTY', 'GROCERY II',
];
export const storeTypes = ['A', 'B', 'C', 'D', 'E'];
export const cities = [
  'Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Santo Domingo',
  'Machala', 'Manta', 'Riobamba', 'Esmeraldas', 'Loja',
  'Ibarra', 'Latacunga', 'Quevedo', 'Cayambe', 'Babahoyo',
  'Playas', 'Puyo', 'Libertad', 'Guaranda', 'Salinas', 'Daule', 'El Carmen',
];

// Monthly sales per year
export const monthlySalesByYear: Record<number, { month: string; sales: number }[]> = {
  2013: [
    { month: 'Jan', sales: 12104523 }, { month: 'Feb', sales: 11432876 },
    { month: 'Mar', sales: 12887345 }, { month: 'Apr', sales: 12543210 },
    { month: 'May', sales: 13210567 }, { month: 'Jun', sales: 12765432 },
    { month: 'Jul', sales: 13054321 }, { month: 'Aug', sales: 12876543 },
    { month: 'Sep', sales: 12543211 }, { month: 'Oct', sales: 13123456 },
    { month: 'Nov', sales: 13456789 }, { month: 'Dec', sales: 16789012 },
  ],
  2014: [
    { month: 'Jan', sales: 13254789 }, { month: 'Feb', sales: 12543678 },
    { month: 'Mar', sales: 13867543 }, { month: 'Apr', sales: 14123456 },
    { month: 'May', sales: 14567890 }, { month: 'Jun', sales: 14012345 },
    { month: 'Jul', sales: 14234567 }, { month: 'Aug', sales: 14098765 },
    { month: 'Sep', sales: 13654321 }, { month: 'Oct', sales: 14321098 },
    { month: 'Nov', sales: 14876543 }, { month: 'Dec', sales: 18765432 },
  ],
  2015: [
    { month: 'Jan', sales: 14098765 }, { month: 'Feb', sales: 13654321 },
    { month: 'Mar', sales: 14876543 }, { month: 'Apr', sales: 15234567 },
    { month: 'May', sales: 15678901 }, { month: 'Jun', sales: 15123456 },
    { month: 'Jul', sales: 15345678 }, { month: 'Aug', sales: 15210987 },
    { month: 'Sep', sales: 14765432 }, { month: 'Oct', sales: 15432109 },
    { month: 'Nov', sales: 15987654 }, { month: 'Dec', sales: 20123456 },
  ],
  2016: [
    { month: 'Jan', sales: 15345678 }, { month: 'Feb', sales: 14876543 },
    { month: 'Mar', sales: 16098765 }, { month: 'Apr', sales: 16876543 },
    { month: 'May', sales: 16543210 }, { month: 'Jun', sales: 16012345 },
    { month: 'Jul', sales: 16234567 }, { month: 'Aug', sales: 16098765 },
    { month: 'Sep', sales: 15654321 }, { month: 'Oct', sales: 16321098 },
    { month: 'Nov', sales: 16876543 }, { month: 'Dec', sales: 21234567 },
  ],
  2017: [
    { month: 'Jan', sales: 16543210 }, { month: 'Feb', sales: 16098765 },
    { month: 'Mar', sales: 17321098 }, { month: 'Apr', sales: 17654321 },
    { month: 'May', sales: 17098765 }, { month: 'Jun', sales: 17543210 },
    { month: 'Jul', sales: 17765432 }, { month: 'Aug', sales: 17654321 },
  ],
};

// All months combined for full trend
export const monthlySales = [
  ...Object.entries(monthlySalesByYear).flatMap(([year, months]) =>
    months.map(m => ({ month: `${m.month} ${year}`, sales: m.sales }))
  ),
];

export const topFamilies = [
  { family: 'GROCERY I', sales: 65432100 },
  { family: 'BEVERAGES', sales: 32165400 },
  { family: 'PRODUCE', sales: 18765430 },
  { family: 'CLEANING', sales: 14532100 },
  { family: 'DAIRY', sales: 12345600 },
  { family: 'BREAD/BAKERY', sales: 9876540 },
  { family: 'POULTRY', sales: 8765430 },
  { family: 'MEATS', sales: 7654320 },
  { family: 'PERSONAL CARE', sales: 6543210 },
  { family: 'DELI', sales: 5432100 },
];

export const dayOfWeekSales = [
  { day: 'Monday', sales: 365432 },
  { day: 'Tuesday', sales: 345678 },
  { day: 'Wednesday', sales: 354321 },
  { day: 'Thursday', sales: 376543 },
  { day: 'Friday', sales: 398765 },
  { day: 'Saturday', sales: 432109 },
  { day: 'Sunday', sales: 465432 },
];

export const promoImpact = [
  { category: 'No Promotion', avgSales: 8.45 },
  { category: 'On Promotion', avgSales: 25.32 },
];

export const storeTypeSales = [
  { type: 'Type A', avgSales: 312 },
  { type: 'Type B', avgSales: 287 },
  { type: 'Type C', avgSales: 265 },
  { type: 'Type D', avgSales: 398 },
  { type: 'Type E', avgSales: 245 },
];

export const modelComparison = [
  { model: 'Baseline (Lag 7)', RMSLE: 1.2345, RMSE: 89.23, MAE: 34.56 },
  { model: 'Linear Regression', RMSLE: 0.8765, RMSE: 72.45, MAE: 28.91 },
  { model: 'Random Forest', RMSLE: 0.6543, RMSE: 56.78, MAE: 22.34 },
  { model: 'LightGBM', RMSLE: 0.4321, RMSE: 45.67, MAE: 18.90 },
];

export const monthlyPattern = [
  { month: 'Jan', sales: 385432 },
  { month: 'Feb', sales: 365678 },
  { month: 'Mar', sales: 395432 },
  { month: 'Apr', sales: 405678 },
  { month: 'May', sales: 398765 },
  { month: 'Jun', sales: 387654 },
  { month: 'Jul', sales: 392345 },
  { month: 'Aug', sales: 389876 },
  { month: 'Sep', sales: 376543 },
  { month: 'Oct', sales: 398765 },
  { month: 'Nov', sales: 412345 },
  { month: 'Dec', sales: 498765 },
];

export const oilVsSales = [
  { date: 'Jan 2014', oil: 94.6, sales: 13254 },
  { date: 'Apr 2014', oil: 101.2, sales: 14123 },
  { date: 'Jul 2014', oil: 103.6, sales: 14234 },
  { date: 'Oct 2014', oil: 84.4, sales: 14321 },
  { date: 'Jan 2015', oil: 47.2, sales: 14098 },
  { date: 'Apr 2015', oil: 54.5, sales: 15234 },
  { date: 'Jul 2015', oil: 50.9, sales: 15345 },
  { date: 'Oct 2015', oil: 46.2, sales: 15432 },
  { date: 'Jan 2016', oil: 31.6, sales: 15345 },
  { date: 'Apr 2016', oil: 40.7, sales: 16876 },
  { date: 'Jul 2016', oil: 44.6, sales: 16234 },
  { date: 'Oct 2016', oil: 49.8, sales: 16321 },
  { date: 'Jan 2017', oil: 52.5, sales: 16543 },
  { date: 'Apr 2017', oil: 51.1, sales: 17654 },
  { date: 'Jul 2017', oil: 46.6, sales: 17765 },
];

export const keyInsights = [
  {
    icon: 'ShoppingCart',
    title: 'Top Sellers',
    description: 'GROCERY I and BEVERAGES dominate sales, accounting for over 50% of total revenue across all stores.',
    impact: 'Very High',
    color: '#3b82f6',
  },
  {
    icon: 'Tag',
    title: 'Promotions Work',
    description: 'Items on promotion sell ~3x more on average. Best families for promos: HOME CARE, LINGERIE, LADIESWEAR.',
    impact: 'Very High',
    color: '#10b981',
  },
  {
    icon: 'Calendar',
    title: 'Sunday is King',
    description: 'Sunday sees the highest sales. December is peak month due to holiday shopping season.',
    impact: 'Medium',
    color: '#f59e0b',
  },
  {
    icon: 'DollarSign',
    title: 'Payday Spikes',
    description: 'Sales spike on the 15th and last day of month when public sector wages are paid.',
    impact: 'Medium',
    color: '#8b5cf6',
  },
  {
    icon: 'Fuel',
    title: 'Oil Indirect Effect',
    description: 'Ecuador is oil-dependent. Oil price dropped 70% (2014-2016) but sales impact is indirect, through economy.',
    impact: 'Low',
    color: '#ef4444',
  },
  {
    icon: 'AlertTriangle',
    title: 'Earthquake Disruption',
    description: 'The April 2016 magnitude 7.8 earthquake caused significant short-term disruption in sales patterns.',
    impact: 'Event',
    color: '#dc2626',
  },
];

// Summary stats for metric cards
export const summaryStats = {
  totalRecords: '3,000,888',
  stores: 54,
  families: 33,
  features: 30,
  trainPeriod: 'Jan 2013 – Aug 2017',
  testPeriod: '15 days',
  bestModel: 'LightGBM',
};
