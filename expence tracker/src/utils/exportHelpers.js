import { formatDate, formatCurrency } from './formatters';

/**
 * Exports an array of transactions to a CSV file.
 * @param {Array} transactions - Array of transaction objects.
 * @param {string} currencyCode - Currency code for formatting.
 * @param {string} fileName - Base filename for export.
 */
export const exportToCSV = (transactions, currencyCode = 'USD', fileName = 'transactions-report') => {
  if (!transactions || transactions.length === 0) {
    throw new Error('No transactions available to export');
  }

  // Define headers
  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
  
  // Format rows
  const rows = transactions.map((t) => [
    formatDate(t.date),
    t.type.toUpperCase(),
    t.categoryName || t.categoryId,
    // Escape commas and double quotes in description
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.amount.toFixed(2),
  ]);

  // Combine into CSV string
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  // Create Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create virtual link
  const link = document.createElement('a');
  link.setAttribute('href', url);
  
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `${fileName}-${dateStr}.csv`);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
