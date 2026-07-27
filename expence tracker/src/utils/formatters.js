import { CURRENCIES } from '../constants/constants';

/**
 * Formats a numeric value into a currency string based on selected currency code.
 * @param {number} value - The numeric value to format.
 * @param {string} currencyCode - The currency code (e.g., USD, EUR).
 * @returns {string} The formatted currency.
 */
export const formatCurrency = (value, currencyCode = 'USD') => {
  const currencyObj = CURRENCIES.find((c) => c.code === currencyCode) || { symbol: '$' };
  
  const options = {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  
  try {
    return new Intl.NumberFormat('en-US', options).format(value);
  } catch (error) {
    // Fallback if Intl fails or currency code is custom
    const num = Number(value).toFixed(2);
    return `${currencyObj.symbol}${num}`;
  }
};

/**
 * Formats a date string or object into a human-readable date.
 * @param {string|Date} date - The date to format.
 * @param {boolean} includeTime - Whether to include hours and minutes.
 * @returns {string} The formatted date.
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return '';
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(d);
};

/**
 * Formats a percentage value.
 * @param {number} value - Decimal value (e.g., 0.85).
 * @returns {string} Formatted percentage (e.g., 85%).
 */
export const formatPercentage = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};
