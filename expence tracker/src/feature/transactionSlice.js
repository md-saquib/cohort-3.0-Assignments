import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storageService from '../services/storageService';

export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async (_, { rejectWithValue }) => {
    try {
      return await storageService.getTransactions();
    } catch (e) {
      return rejectWithValue('Failed to fetch transactions');
    }
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async ({ userId, title, description, amount, type, categoryId, paymentMethod, date, notes }, { rejectWithValue }) => {
    try {
      const txs = await storageService.getTransactions();
      const nowString = new Date().toISOString();
      const newTx = {
        id: `tx_${Date.now()}`,
        userId,
        title: title || 'Untitled Transaction',
        description: description || '',
        amount: Number(amount),
        type,
        categoryId,
        paymentMethod: paymentMethod || 'Cash',
        date,
        createdAt: nowString,
        updatedAt: nowString,
        notes: notes || '',
      };
      txs.push(newTx);
      await storageService.saveTransactions(txs);
      return newTx;
    } catch (e) {
      return rejectWithValue('Failed to add transaction');
    }
  }
);

export const editTransaction = createAsyncThunk(
  'transactions/editTransaction',
  async ({ transactionId, data }, { rejectWithValue }) => {
    try {
      const txs = await storageService.getTransactions();
      const idx = txs.findIndex(t => t.id === transactionId);
      if (idx === -1) return rejectWithValue('Transaction not found');

      txs[idx] = {
        ...txs[idx],
        ...data,
        amount: Number(data.amount),
        updatedAt: new Date().toISOString(),
      };
      await storageService.saveTransactions(txs);
      return txs[idx];
    } catch (e) {
      return rejectWithValue('Failed to edit transaction');
    }
  }
);

export const removeTransaction = createAsyncThunk(
  'transactions/removeTransaction',
  async (transactionId, { rejectWithValue }) => {
    try {
      let txs = await storageService.getTransactions();
      txs = txs.filter(t => t.id !== transactionId);
      await storageService.saveTransactions(txs);
      return transactionId;
    } catch (e) {
      return rejectWithValue('Failed to delete transaction');
    }
  }
);

export const duplicateTransaction = createAsyncThunk(
  'transactions/duplicateTransaction',
  async (transactionId, { rejectWithValue }) => {
    try {
      const txs = await storageService.getTransactions();
      const target = txs.find(t => t.id === transactionId);
      if (!target) return rejectWithValue('Transaction not found to duplicate');

      const nowString = new Date().toISOString();
      const clonedTx = {
        ...target,
        id: `tx_dup_${Date.now()}`,
        title: `${target.title} (Copy)`,
        date: new Date().toISOString().split('T')[0], // Set copy date to today
        createdAt: nowString,
        updatedAt: nowString,
      };

      txs.push(clonedTx);
      await storageService.saveTransactions(txs);
      return clonedTx;
    } catch (e) {
      return rejectWithValue('Failed to duplicate transaction');
    }
  }
);

export const clearTransactions = createAsyncThunk(
  'transactions/clearTransactions',
  async (userId, { rejectWithValue }) => {
    try {
      await storageService.clearAllUserData(userId);
      return null;
    } catch (e) {
      return rejectWithValue('Failed to clear database');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  filters: {
    type: 'all',          
    categoryId: 'all',    
    search: '',
    dateRange: 'all',     
    customStartDate: '',
    customEndDate: '',
    sortBy: 'date-desc',  
    month: 'all',         
    year: 'all',          
    amountMin: '',        
    amountMax: '',        
    paymentMethod: 'all', 
  },
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {

    setFilter: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(editTransaction.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      })

      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      })

      .addCase(duplicateTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(clearTransactions.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { setFilter, resetFilters } = transactionSlice.actions;
export default transactionSlice.reducer;

// Selector helpers
export const selectTransactions = (state) => state.transactions.items;
export const selectTransactionFilters = (state) => state.transactions.filters;

import { createSelector } from '@reduxjs/toolkit';
import { DEFAULT_CATEGORIES } from '../constants/constants';

// --- MEMOIZED BUSINESS SELECTORS (MVC Controller Layer) ---
export const selectMonthlyTotals = createSelector(
  [selectTransactions],
  (items) => {
    let income = 0;
    let expense = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    items.forEach((t) => {
      const d = new Date(t.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const amt = Number(t.amount);
        if (t.type === 'income') {
          income += amt;
        } else {
          expense += amt;
        }
      }
    });

    return {
      income,
      expense,
      balance: income - expense,
    };
  }
);

export const selectCategoryDetails = createSelector(
  [selectTransactions],
  (items) => {
    const incomeDetails = {};
    const expenseDetails = {};

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const categoryMapping = {};
    [...DEFAULT_CATEGORIES.income, ...DEFAULT_CATEGORIES.expense].forEach(c => {
      categoryMapping[c.id] = c;
    });

    items.forEach((t) => {
      const d = new Date(t.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const amt = Number(t.amount);
        const cat = categoryMapping[t.categoryId] || { name: 'Others' };

        if (t.type === 'income') {
          incomeDetails[cat.name] = (incomeDetails[cat.name] || 0) + amt;
        } else {
          expenseDetails[cat.name] = (expenseDetails[cat.name] || 0) + amt;
        }
      }
    });

    return {
      incomeList: Object.entries(incomeDetails).sort((a, b) => b[1] - a[1]),
      expenseList: Object.entries(expenseDetails).sort((a, b) => b[1] - a[1]),
    };
  }
);

export const selectAccountsBalances = createSelector(
  [selectTransactions],
  (items) => {
    let cash = 154.10;
    let savings = 2586.00;


    items.forEach((t) => {
      if (new Date(t.date) > new Date('2024-01-26')) {
        const amt = Number(t.amount);
        if (t.type === 'income') {
          savings += amt;
        } else {
          if (t.categoryId === 'exp_food' || t.categoryId === 'exp_shopping') {
            cash -= amt;
          } else {
            savings -= amt;
          }
        }
      }
    });

    return { cash, savings };
  }
);

export const selectRecentTransactionsList = createSelector(
  [selectTransactions],
  (items) => {
    return [...items]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }
);

// --- MEMOIZED GRAPH SELECTORS (MVC Controller Layer) ---

export const selectMonthlyChartData = createSelector(
  [selectTransactions],
  (items) => {
    const weeks = {
      'W1': { name: 'Week 1', Income: 0, Expense: 0 },
      'W2': { name: 'Week 2', Income: 0, Expense: 0 },
      'W3': { name: 'Week 3', Income: 0, Expense: 0 },
      'W4': { name: 'Week 4', Income: 0, Expense: 0 },
    };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    items.forEach((t) => {
      const d = new Date(t.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const day = d.getDate();
        let weekKey = 'W4';
        if (day <= 7) weekKey = 'W1';
        else if (day <= 14) weekKey = 'W2';
        else if (day <= 21) weekKey = 'W3';

        if (t.type === 'income') {
          weeks[weekKey].Income += t.amount;
        } else {
          weeks[weekKey].Expense += t.amount;
        }
      }
    });

    return Object.values(weeks);
  }
);

export const selectCategoryShareChartData = createSelector(
  [selectTransactions],
  (items) => {
    const categories = {};
    const categoryMapping = {};
    [...DEFAULT_CATEGORIES.income, ...DEFAULT_CATEGORIES.expense].forEach(c => {
      categoryMapping[c.id] = c;
    });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    items.forEach((t) => {
      const d = new Date(t.date);
      if (t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const cat = categoryMapping[t.categoryId] || { name: 'Others', color: '#94a3b8' };
        categories[cat.name] = (categories[cat.name] || 0) + t.amount;
      }
    });

    return Object.entries(categories)
      .map(([name, value]) => {
        const matchingCat = [...DEFAULT_CATEGORIES.income, ...DEFAULT_CATEGORIES.expense].find(c => c.name === name);
        return {
          name,
          value,
          color: matchingCat ? matchingCat.color : '#94a3b8',
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  }
);



export const selectFilteredTransactionsList = (state) => {
  const { items, filters } = state.transactions;
  let result = [...items];

  // Search filter (searches title and description and notes)
  if (filters.search.trim()) {
    const searchLow = filters.search.toLowerCase();
    result = result.filter(t =>
      t.title.toLowerCase().includes(searchLow) ||
      t.description.toLowerCase().includes(searchLow) ||
      (t.notes && t.notes.toLowerCase().includes(searchLow))
    );
  }

  // Type filter
  if (filters.type !== 'all') {
    result = result.filter(t => t.type === filters.type);
  }

  // Category filter
  if (filters.categoryId !== 'all') {
    result = result.filter(t => t.categoryId === filters.categoryId);
  }

  // Month filter
  if (filters.month !== 'all') {
    result = result.filter(t => {
      const d = new Date(t.date);
      return d.getMonth().toString() === filters.month.toString();
    });
  }

  // Year filter
  if (filters.year !== 'all') {
    result = result.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear().toString() === filters.year.toString();
    });
  }

  // Amount Min filter
  if (filters.amountMin !== '') {
    const minVal = Number(filters.amountMin);
    result = result.filter(t => t.amount >= minVal);
  }

  // Amount Max filter
  if (filters.amountMax !== '') {
    const maxVal = Number(filters.amountMax);
    result = result.filter(t => t.amount <= maxVal);
  }

  // Payment Method filter
  if (filters.paymentMethod !== 'all') {
    result = result.filter(t => t.paymentMethod === filters.paymentMethod);
  }

  // Date Range filter
  if (filters.dateRange !== 'all') {
    const now = new Date();
    if (filters.dateRange === 'week') {
      const boundary = new Date();
      boundary.setDate(now.getDate() - 7);
      result = result.filter(t => new Date(t.date) >= boundary);
    } else if (filters.dateRange === 'month') {
      const boundary = new Date();
      boundary.setMonth(now.getMonth() - 1);
      result = result.filter(t => new Date(t.date) >= boundary);
    } else if (filters.dateRange === 'custom') {
      if (filters.customStartDate) {
        const start = new Date(filters.customStartDate);
        start.setHours(0, 0, 0, 0);
        result = result.filter(t => new Date(t.date) >= start);
      }
      if (filters.customEndDate) {
        const end = new Date(filters.customEndDate);
        end.setHours(23, 59, 59, 999);
        result = result.filter(t => new Date(t.date) <= end);
      }
    }
  }

  // Sort
  result.sort((a, b) => {
    if (filters.sortBy === 'date-desc') {
      return new Date(b.date) - new Date(a.date);
    }
    if (filters.sortBy === 'date-asc') {
      return new Date(a.date) - new Date(b.date);
    }
    if (filters.sortBy === 'amount-desc') {
      return b.amount - a.amount;
    }
    if (filters.sortBy === 'amount-asc') {
      return a.amount - b.amount;
    }
    return 0;
  });

  return result;
};
