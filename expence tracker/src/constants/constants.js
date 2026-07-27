export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (CAD)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)' },
];

export const PAYMENT_METHODS = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Card', label: 'Credit/Debit Card' },
  { value: 'Paypal', label: 'Paypal' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
];

export const DEFAULT_CATEGORIES = {
  income: [
    { id: 'inc_salary', name: 'Salary', color: '#10B981', icon: 'FaWallet' },
    { id: 'inc_investment', name: 'Investment', color: '#8B5CF6', icon: 'FaChartLine' },
    { id: 'inc_others', name: 'Others', color: '#6B7280', icon: 'FaCoins' },
  ],
  expense: [
    { id: 'exp_food', name: 'Food', color: '#3b82f6', icon: 'FaShoppingBasket' },
    { id: 'exp_shopping', name: 'Shopping', color: '#ec4899', icon: 'FaShoppingBag' },
    { id: 'exp_bills', name: 'Bills', color: '#ef4444', icon: 'FaLightbulb' },
    { id: 'exp_transport', name: 'Transport', color: '#06b6d4', icon: 'FaCar' },
    { id: 'exp_medical', name: 'Medical', color: '#10b981', icon: 'FaHeartbeat' },
    { id: 'exp_education', name: 'Education', color: '#6366f1', icon: 'FaGraduationCap' },
    { id: 'exp_travel', name: 'Travel', color: '#14b8a6', icon: 'FaPlane' },
    { id: 'exp_entertainment', name: 'Entertainment', color: '#f59e0b', icon: 'FaTv' },
    { id: 'exp_others', name: 'Others', color: '#94a3b8', icon: 'FaEllipsisH' },
  ],
};

export const INITIAL_USER_SETTINGS = {
  currency: 'USD',
  theme: 'light',
};
