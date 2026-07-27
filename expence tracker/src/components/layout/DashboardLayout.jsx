import React, { useState, useEffect, useRef, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaThLarge, FaExchangeAlt, FaChartBar, FaWallet, FaFileAlt,
  FaUser, FaCog, FaSignOutAlt, FaMoon, FaSun, FaBell,
  FaPlus, FaBars, FaTimes, FaCoins, FaExclamationTriangle, FaChevronDown
} from 'react-icons/fa';
import { logoutUser } from '../../feature/authSlice';
import {
  getTransactions, addTransaction, selectTransactions,
  selectMonthlyTotals, selectAccountsBalances
} from '../../feature/transactionSlice';
import { formatCurrency } from '../../utils/formatters';
import { DEFAULT_CATEGORIES, PAYMENT_METHODS } from '../../constants/constants';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import toast from 'react-hot-toast';

export const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);
  const transactions = useSelector(selectTransactions);

  const currency = user?.settings?.currency || 'USD';
  const theme = user?.settings?.theme || 'light';

  // Read calculations from memoized selectors (MVC Controller)
  const monthSummary = useSelector(selectMonthlyTotals);
  const accountsBalances = useSelector(selectAccountsBalances);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAlertsDropdownOpen, setIsAlertsDropdownOpen] = useState(false);
  const [isQuickAddSubmitting, setIsQuickAddSubmitting] = useState(false);
  const alertsRef = useRef();

  // Load core data on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(getTransactions());
    }
  }, [dispatch, user?.id]);

  // Click outside listener for Alerts dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target)) {
        setIsAlertsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    // Update HTML classes
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    dispatch(updateUserProfile({
      userId: user.id,
      name: user.name,
      email: user.email,
      theme: nextTheme,
    }));
  };

  // Sidebar navigation menu
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FaThLarge },
    { name: 'Transactions', path: '/transactions', icon: FaExchangeAlt },
  ];

  // Budget alerts placeholder since budgets are removed
  const budgetAlerts = [];

  // Quick Add State
  const [quickAddType, setQuickAddType] = useState('expense');
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [quickAddCategory, setQuickAddCategory] = useState('');
  const [quickAddAmount, setQuickAddAmount] = useState('');
  const [quickAddPaymentMethod, setQuickAddPaymentMethod] = useState('Cash');
  const [quickAddDate, setQuickAddDate] = useState(new Date().toISOString().split('T')[0]);
  const [quickAddDescription, setQuickAddDescription] = useState('');
  const [quickAddNotes, setQuickAddNotes] = useState('');

  const activeCategories = useMemo(() => {
    return DEFAULT_CATEGORIES[quickAddType] || [];
  }, [quickAddType]);

  const handleQuickAddSubmit = async (e) => {
    e.preventDefault();
    if (!quickAddTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!quickAddCategory) {
      toast.error('Please select a category');
      return;
    }
    if (!quickAddAmount || isNaN(Number(quickAddAmount)) || Number(quickAddAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsQuickAddSubmitting(true);
    try {
      await dispatch(addTransaction({
        userId: user.id,
        type: quickAddType,
        title: quickAddTitle.trim(),
        categoryId: quickAddCategory,
        amount: Number(quickAddAmount),
        paymentMethod: quickAddPaymentMethod,
        date: quickAddDate,
        description: quickAddDescription,
        notes: quickAddNotes.trim(),
      })).unwrap();

      toast.success('Transaction logged!');
      setQuickAddTitle('');
      setQuickAddAmount('');
      setQuickAddDescription('');
      setQuickAddCategory('');
      setQuickAddPaymentMethod('Cash');
      setQuickAddNotes('');
      setIsQuickAddOpen(false);
    } catch (err) {
      toast.error('Failed to add transaction');
    } finally {
      setIsQuickAddSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">

      {/* Collapsible Left Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'
          } shrink-0 overflow-y-auto`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <svg className="w-8 h-8 shrink-0 fill-none" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="#3b82f6" />
            <path d="M6 17L10 13L14 15L18 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isSidebarOpen && (
            <span className="text-lg font-extrabold tracking-tight text-white">
              My Finances
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 gap-3
                  ${isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Widgets (Only shown if Sidebar is expanded) */}
        {isSidebarOpen && (
          <div className="px-5 py-2 space-y-6 flex-1 border-t border-slate-800/80 pt-6">

            {/* Widget 1: This Month Summary */}
            <div className="bg-slate-800/50 border border-slate-800 p-4 rounded-2xl space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                This Month Summary
              </h4>
              <div className="space-y-2 text-xs font-medium text-slate-300">
                <div className="flex justify-between">
                  <span>Income</span>
                  <span className="text-emerald-400">{formatCurrency(monthSummary.income, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expense</span>
                  <span className="text-rose-400">{formatCurrency(monthSummary.expense, currency)}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-slate-700/60 font-bold text-white">
                  <span>Balance</span>
                  <span>{formatCurrency(monthSummary.balance, currency)}</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Accounts */}
            <div className="bg-slate-800/50 border border-slate-800 p-4 rounded-2xl space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Accounts
              </h4>
              <div className="space-y-2 text-xs font-medium text-slate-300">
                <div className="flex justify-between">
                  <span>Cash</span>
                  <span className="text-white">{formatCurrency(accountsBalances.cash, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Savings</span>
                  <span className="text-white">{formatCurrency(accountsBalances.savings, currency)}</span>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Logout button */}
        <div className="p-4 border-t border-slate-800 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-rose-400 rounded-xl hover:bg-slate-800 transition-colors gap-3"
          >
            <FaSignOutAlt className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (Drawer Side Panel) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="relative z-10 w-64 bg-slate-900 text-slate-200 flex flex-col p-4">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 fill-none" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="6" fill="#3b82f6" />
                  <path d="M6 17L10 13L14 15L18 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-lg font-bold text-white">My Finances</span>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 gap-3
                      ${isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-450 hover:bg-slate-800'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-rose-450 rounded-xl hover:bg-slate-800 gap-3"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm shadow-slate-100/10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <FaBars className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:block text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <FaBars className="w-5 h-5" />
            </button>
            <h1 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100">
              SpendWise Platform
            </h1>
          </div>

          <div className="flex items-center gap-3">

            {/* Quick Add */}
            <Button
              variant="primary"
              size="sm"
              className="rounded-xl py-1.5 px-3.5 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setQuickAddType('expense');
                setQuickAddCategory('');
                setIsQuickAddOpen(true);
              }}
            >
              <FaPlus className="w-3 h-3" />
              <span className="hidden sm:inline">Add Transaction</span>
            </Button>

            {/* Theme Toggle */}
            <button
              onClick={handleToggleTheme}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <FaSun className="w-4 h-4 text-amber-400" />
              ) : (
                <FaMoon className="w-4 h-4" />
              )}
            </button>

            {/* Profile Avatar */}
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow select-none"
            >
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </div>

          </div>
        </header>

        {/* View Layout pages */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-950">
          {children}
        </main>
      </div>

      {/* QUICK ADD MODAL */}
      <Modal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        title="Quick Log Transaction"
      >
        <form onSubmit={handleQuickAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setQuickAddType('expense');
                setQuickAddCategory('');
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${quickAddType === 'expense'
                ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm'
                : 'text-slate-550 hover:text-slate-700'
                }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setQuickAddType('income');
                setQuickAddCategory('');
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${quickAddType === 'income'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm'
                : 'text-slate-550 hover:text-slate-700'
                }`}
            >
              Income
            </button>
          </div>

          <Input
            id="qa-title"
            label="Title"
            placeholder="e.g. Walmart Groceries"
            value={quickAddTitle}
            onChange={(e) => setQuickAddTitle(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="qa-amount"
              label="Amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={quickAddAmount}
              onChange={(e) => setQuickAddAmount(e.target.value)}
              required
            />

            <Select
              id="qa-category"
              label="Category"
              placeholder="Select a category"
              value={quickAddCategory}
              onChange={(e) => setQuickAddCategory(e.target.value)}
              options={activeCategories.map((c) => ({ value: c.id, label: c.name }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              id="qa-payment"
              label="Payment Method"
              placeholder="Select method"
              value={quickAddPaymentMethod}
              onChange={(e) => setQuickAddPaymentMethod(e.target.value)}
              options={PAYMENT_METHODS}
              required
            />

            <Input
              id="qa-date"
              label="Date"
              type="date"
              value={quickAddDate}
              onChange={(e) => setQuickAddDate(e.target.value)}
              required
            />
          </div>

          <Input
            id="qa-desc"
            label="Description"
            placeholder="e.g. Weekly vegetable run"
            value={quickAddDescription}
            onChange={(e) => setQuickAddDescription(e.target.value)}
            maxLength={100}
          />

          <div className="space-y-1">
            <label htmlFor="qa-notes" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Notes
            </label>
            <textarea
              id="qa-notes"
              placeholder="Add details, tags, or links..."
              value={quickAddNotes}
              onChange={(e) => setQuickAddNotes(e.target.value)}
              maxLength={250}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[70px] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsQuickAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={quickAddType === 'expense' ? 'danger' : 'primary'}
              isLoading={isQuickAddSubmitting}
            >
              Save
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default DashboardLayout;
