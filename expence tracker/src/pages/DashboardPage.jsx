import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import {
  getTransactions, selectTransactions,
  addTransaction, removeTransaction, duplicateTransaction, editTransaction,
  clearTransactions,
  selectMonthlyTotals, selectCategoryDetails, selectAccountsBalances, selectRecentTransactionsList,
  selectMonthlyChartData, selectCategoryShareChartData
} from '../feature/transactionSlice';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DEFAULT_CATEGORIES, PAYMENT_METHODS } from '../constants/constants';
import { storageService } from '../services/storageService';
import {
  FaCalendarAlt, FaPlus, FaWallet, FaExchangeAlt, FaArrowRight,
  FaCoins, FaInfoCircle, FaCopy, FaTrashAlt, FaEdit, FaChevronRight,
  FaCheck, FaPiggyBank, FaShieldAlt, FaDownload, FaUpload, FaTrash
} from 'react-icons/fa';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell
} from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const currency = user?.settings?.currency || 'USD';

  // Read data from memoized selectors (MVC Controller layer)
  const monthlyTotals = useSelector(selectMonthlyTotals);
  const categoryDetails = useSelector(selectCategoryDetails);
  const accountsBalances = useSelector(selectAccountsBalances);
  const recentTransactionsList = useSelector(selectRecentTransactionsList);
  const areaChartData = useSelector(selectMonthlyChartData);
  const pieChartData = useSelector(selectCategoryShareChartData);

  // Modal controls
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState('income');
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Portability state indicators
  const [isBackupSaving, setIsBackupSaving] = useState(false);
  const [isRestoreSaving, setIsRestoreSaving] = useState(false);
  const [isResetSaving, setIsResetSaving] = useState(false);

  // React Hook Form setup
  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      amount: '',
      categoryId: '',
      paymentMethod: 'Cash',
      date: new Date().toISOString().split('T')[0],
      description: '',
      notes: '',
    }
  });

  // Load seeds on mount
  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  // Sync edit mode details in React Hook Form
  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setModalType(tx.type);

    // Set form fields
    reset({
      title: tx.title,
      amount: tx.amount.toString(),
      categoryId: tx.categoryId,
      paymentMethod: tx.paymentMethod || 'Cash',
      date: tx.date,
      description: tx.description || '',
      notes: tx.notes || '',
    });

    setIsAddModalOpen(true);
  };

  const handleOpenAdd = (type) => {
    setEditingTransaction(null);
    setModalType(type);

    reset({
      title: '',
      amount: '',
      categoryId: '',
      paymentMethod: 'Cash',
      date: new Date().toISOString().split('T')[0],
      description: '',
      notes: '',
    });

    setIsAddModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingTransaction) {
        await dispatch(editTransaction({
          transactionId: editingTransaction.id,
          data: {
            type: modalType,
            title: data.title.trim(),
            categoryId: data.categoryId,
            amount: Number(data.amount),
            paymentMethod: data.paymentMethod,
            date: data.date,
            description: data.description,
            notes: data.notes.trim(),
          }
        })).unwrap();
        toast.success('Transaction updated!');
      } else {
        await dispatch(addTransaction({
          userId: user.id,
          type: modalType,
          title: data.title.trim(),
          categoryId: data.categoryId,
          amount: Number(data.amount),
          paymentMethod: data.paymentMethod,
          date: data.date,
          description: data.description,
          notes: data.notes.trim(),
        })).unwrap();
        toast.success('Transaction logged!');
      }
      setIsAddModalOpen(false);
    } catch (err) {
      toast.error('Failed to log transaction');
    }
  };

  const handleDuplicate = async (txId) => {
    try {
      await dispatch(duplicateTransaction(txId)).unwrap();
      toast.success('Cloned successfully to today!');
    } catch (err) {
      toast.error('Failed to duplicate transaction');
    }
  };

  const handleDelete = async (txId) => {
    if (window.confirm('Delete this record?')) {
      try {
        await dispatch(removeTransaction(txId)).unwrap();
        toast.success('Transaction deleted');
      } catch (err) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  // Portability Actions
  const handleBackupData = async () => {
    setIsBackupSaving(true);
    try {
      const data = await storageService.exportBackupData(user.id);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `spendwise-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Backup downloaded successfully!');
    } catch (e) {
      toast.error('Failed to compile backup');
    } finally {
      setIsBackupSaving(false);
    }
  };

  const handleRestoreData = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRestoreSaving(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        await storageService.importRestoreData(user.id, backup);
        toast.success('Data restored successfully! Reloading...');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err) {
        toast.error('Failed to parse backup file');
      } finally {
        setIsRestoreSaving(false);
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = async () => {
    if (window.confirm('Clear all your ledger history? This cannot be undone.')) {
      setIsResetSaving(true);
      try {
        await dispatch(clearTransactions(user.id)).unwrap();
        toast.success('Sandbox database reset successfully!');
      } catch (e) {
        toast.error('Failed to clear database');
      } finally {
        setIsResetSaving(false);
      }
    }
  };

  // Map category details
  const categoryMap = useMemo(() => {
    const all = [
      ...DEFAULT_CATEGORIES.income,
      ...DEFAULT_CATEGORIES.expense,
    ];
    return all.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {});
  }, []);

  return (
    <div className="space-y-6 font-sans animate-fadeIn max-w-6xl mx-auto">

      {/* 1. Welcome Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Hello, {user?.name || 'User'}!
          </h2>
          <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">
            Welcome to your Expense Tracker Dashboard. Read and aggregate your logs securely.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenAdd('expense')}
            className="border-rose-100 hover:bg-rose-50/35 text-rose-600 rounded-xl"
          >
            <FaPlus className="mr-1.5 w-3 h-3" /> Log Expense
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenAdd('income')}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10"
          >
            <FaPlus className="mr-1.5 w-3 h-3" /> Log Income
          </Button>
        </div>
      </div>

      {/* 2. Summary Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card A: Balance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow transition-shadow">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
            Total Balance
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(monthlyTotals.balance, currency)}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/60">
            <div className="flex justify-between items-center text-[10px] font-bold mb-1">
              <span className="text-slate-400">Car Goal savings</span>
              <span className="text-blue-500">50%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="w-[50%] h-full bg-blue-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Card B: Income */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow transition-shadow">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
            Income
          </span>
          <div className="text-2xl font-black text-emerald-605 dark:text-emerald-500 tracking-tight">
            {formatCurrency(monthlyTotals.income, currency)}
          </div>
          <div className="mt-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-50 dark:border-slate-800/60 truncate">
            Details: {categoryDetails.incomeList[0] ? `${categoryDetails.incomeList[0][0]} (${formatCurrency(categoryDetails.incomeList[0][1], currency)})` : 'None'}
          </div>
        </div>

        {/* Card C: Expenses */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow transition-shadow">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
            Expenses
          </span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-500 tracking-tight">
            {formatCurrency(monthlyTotals.expense, currency)}
          </div>
          <div className="mt-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-50 dark:border-slate-800/60 truncate">
            Details: {categoryDetails.expenseList[0] ? `${categoryDetails.expenseList[0][0]} (${formatCurrency(categoryDetails.expenseList[0][1], currency)})` : 'None'}
          </div>
        </div>

        {/* Card D: Savings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow transition-shadow">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
            Savings Account
          </span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
            {formatCurrency(accountsBalances.savings, currency)}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/60">
            <div className="flex justify-between items-center text-[10px] font-bold mb-1">
              <span className="text-slate-400">Student Loan repayments</span>
              <span className="text-rose-500">20%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div className="w-[20%] h-full bg-blue-500" />
              <div className="w-[10%] h-full bg-orange-500" />
            </div>
          </div>
        </div>

      </div>

      {/* 3. Monthly Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Monthly Activity AreaChart */}
        <Card title="Monthly Overview" className="lg:col-span-2" description="Income vs Expense distribution of current month">
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  formatter={(value) => formatCurrency(value, currency)}
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Area name="Income" type="monotone" dataKey="Income" stroke="#10b981" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
                <Area name="Expense" type="monotone" dataKey="Expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Spending Categories pie chart */}
        <Card title="Top Categories" description="Monthly expense category breakdown">
          <div className="h-64 w-full flex flex-col justify-center items-center">
            {pieChartData.length === 0 ? (
              <div className="text-center text-slate-450 py-12">
                <FaInfoCircle className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-850 mb-2" />
                <p className="text-xs">No expenses cataloged this month</p>
              </div>
            ) : (
              <>
                <div className="h-40 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full space-y-2 mt-2 max-h-20 overflow-y-auto px-1">
                  {pieChartData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] font-medium">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-650 dark:text-slate-400 truncate">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {formatCurrency(item.value, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>

      </div>

      {/* 4. Bottom Grid: Recent Transactions, Budgets & Data Portability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Transactions lists (Col-span 2) */}
        <Card
          title="Recent Transactions"
          description="Your latest ledger entries"
          className="lg:col-span-2"
        >
          {recentTransactionsList.length === 0 ? (
            <p className="text-xs text-slate-450 italic py-10 text-center">No transaction records found</p>
          ) : (
            <div className="space-y-2.5 pt-1">
              {recentTransactionsList.map((tx) => {
                const cat = categoryMap[tx.categoryId] || { name: 'Others', color: '#94a3b8' };
                return (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-900 border border-slate-100/50 dark:border-slate-800/80 hover:border-slate-200/50 dark:hover:border-slate-700/60 transition-colors group text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <div className="truncate">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{tx.title}</h4>
                        <span className="text-[10px] text-slate-455 flex items-center gap-2 mt-0.5">
                          <span>{formatDate(tx.date)}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="bg-slate-150 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-semibold">
                            {tx.paymentMethod || 'Cash'}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-extrabold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                      </span>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDuplicate(tx.id)}
                          title="Duplicate Transaction"
                          className="text-slate-450 hover:text-blue-500 p-1.5 bg-white dark:bg-slate-850 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
                        >
                          <FaCopy className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(tx)}
                          title="Edit Transaction"
                          className="text-slate-450 hover:text-indigo-500 p-1.5 bg-white dark:bg-slate-850 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
                        >
                          <FaEdit className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          title="Delete Transaction"
                          className="text-slate-450 hover:text-rose-500 p-1.5 bg-white dark:bg-slate-850 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
                        >
                          <FaTrashAlt className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* SaaS Data Portability widget integrated directly on dashboard */}
        <div className="space-y-6">

          {/* SaaS Data Portability widget integrated directly on dashboard */}
          <Card title="Data Backup & Restore" description="Manage database snapshots locally">
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleBackupData}
                  isLoading={isBackupSaving}
                  variant="outline"
                  className="w-full font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] rounded-xl"
                >
                  <FaDownload /> Export Backup
                </Button>

                <Button
                  onClick={handleClearData}
                  isLoading={isResetSaving}
                  variant="danger"
                  className="w-full font-semibold flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-100"
                >
                  <FaTrash /> Wipe Ledger
                </Button>
              </div>

              <div className="space-y-1 pt-1.5 border-t border-slate-50 dark:border-slate-850">
                <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 block">Restore from JSON backup</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreData}
                  className="w-full border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50/50 dark:bg-slate-900 text-[10px] text-slate-500 cursor-pointer"
                  disabled={isRestoreSaving}
                />
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* QUICK ADD / EDIT MODAL - IMPLEMENTED WITH REACT HOOK FORM */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingTransaction ? 'Edit Transaction' : modalType === 'income' ? 'Add Income Entry' : 'Add Expense Entry'}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

          <div className="space-y-1">
            <label htmlFor="form-title" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Transaction Title
            </label>
            <input
              id="form-title"
              type="text"
              placeholder="e.g. Walmart Groceries"
              className="w-full px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <span className="text-[10px] text-rose-500 font-bold">{errors.title.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="form-amount" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Amount
              </label>
              <input
                id="form-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                {...register('amount', {
                  required: 'Amount is required',
                  validate: value => Number(value) > 0 || 'Amount must be greater than zero'
                })}
              />
              {errors.amount && <span className="text-[10px] text-rose-500 font-bold">{errors.amount.message}</span>}
            </div>

            <div className="space-y-1">
              <label htmlFor="form-category" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Category
              </label>
              <select
                id="form-category"
                className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                {...register('categoryId', { required: 'Please select a category' })}
              >
                <option value="">Select Category</option>
                {DEFAULT_CATEGORIES[modalType].map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <span className="text-[10px] text-rose-500 font-bold">{errors.categoryId.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="form-payment" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Payment Method
              </label>
              <select
                id="form-payment"
                className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                {...register('paymentMethod')}
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="form-date" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Date
              </label>
              <input
                id="form-date"
                type="date"
                className="w-full px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                {...register('date', { required: 'Date is required' })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="form-desc" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Short Description
            </label>
            <input
              id="form-desc"
              type="text"
              placeholder="e.g. Lunch out with colleagues details"
              className="w-full px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              {...register('description')}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="form-notes" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Detailed Notes
            </label>
            <textarea
              id="form-notes"
              placeholder="Add long form explanations, codes, or tags..."
              className="w-full px-4 py-2 border border-slate-250 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[60px] resize-none"
              {...register('notes')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={modalType === 'income' ? 'primary' : 'danger'}
            >
              {editingTransaction ? 'Save Changes' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default DashboardPage;
