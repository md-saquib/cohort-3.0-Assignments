import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaSearch, FaPlus, FaEdit, FaTrashAlt, FaTimes, FaCoins, 
  FaChevronLeft, FaChevronRight, FaCopy, FaChevronDown 
} from 'react-icons/fa';
import { 
  addTransaction, editTransaction, removeTransaction, duplicateTransaction,
  setFilter, resetFilters, selectFilteredTransactionsList, selectTransactionFilters 
} from '../feature/transactionSlice';
import { DEFAULT_CATEGORIES, PAYMENT_METHODS } from '../constants/constants';
import { formatCurrency, formatDate } from '../utils/formatters';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

export const TransactionsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const filters = useSelector(selectTransactionFilters);
  const filteredTransactions = useSelector(selectFilteredTransactionsList);
  
  const currency = user?.settings?.currency || 'USD';

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formType, setFormType] = useState('expense');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formPaymentMethod, setFormPaymentMethod] = useState('Cash');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Resolve Categories map
  const categoriesMap = useMemo(() => {
    const all = [
      ...DEFAULT_CATEGORIES.income,
      ...DEFAULT_CATEGORIES.expense,
    ];
    return all.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {});
  }, []);

  const filterCategoryOptions = useMemo(() => {
    const incomes = DEFAULT_CATEGORIES.income;
    const expenses = DEFAULT_CATEGORIES.expense;
    return [
      { value: 'all', label: 'All Categories' },
      ...incomes.map(c => ({ value: c.id, label: `Income: ${c.name}` })),
      ...expenses.map(c => ({ value: c.id, label: `Expense: ${c.name}` })),
    ];
  }, []);

  const formCategoryOptions = useMemo(() => {
    const list = DEFAULT_CATEGORIES[formType] || [];
    return list.map(c => ({ value: c.id, label: c.name }));
  }, [formType]);

  const paginatedTransactions = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ [key]: value }));
    setCurrentPage(1);
  };

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setFormType('expense');
    setFormTitle('');
    setFormCategory('');
    setFormAmount('');
    setFormPaymentMethod('Cash');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setFormType(tx.type);
    setFormTitle(tx.title);
    setFormCategory(tx.categoryId);
    setFormAmount(tx.amount.toString());
    setFormPaymentMethod(tx.paymentMethod || 'Cash');
    setFormDate(tx.date);
    setFormDescription(tx.description || '');
    setFormNotes(tx.notes || '');
    setIsModalOpen(true);
  };

  const handleDuplicate = async (txId) => {
    try {
      await dispatch(duplicateTransaction(txId)).unwrap();
      toast.success('Cloned successfully to today!');
      setCurrentPage(1);
    } catch (err) {
      toast.error('Failed to clone transaction');
    }
  };

  const handleDelete = async (txId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await dispatch(removeTransaction(txId)).unwrap();
        toast.success('Transaction deleted');
        if (paginatedTransactions.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      } catch (err) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!formCategory) {
      toast.error('Please select a category');
      return;
    }
    if (!formAmount || isNaN(Number(formAmount)) || Number(formAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTransaction) {
        await dispatch(editTransaction({
          transactionId: editingTransaction.id,
          data: {
            type: formType,
            title: formTitle.trim(),
            categoryId: formCategory,
            amount: Number(formAmount),
            paymentMethod: formPaymentMethod,
            date: formDate,
            description: formDescription,
            notes: formNotes.trim(),
          }
        })).unwrap();
        toast.success('Transaction updated!');
      } else {
        await dispatch(addTransaction({
          userId: user.id,
          type: formType,
          title: formTitle.trim(),
          categoryId: formCategory,
          amount: Number(formAmount),
          paymentMethod: formPaymentMethod,
          date: formDate,
          description: formDescription,
          notes: formNotes.trim(),
        })).unwrap();
        toast.success('Transaction added!');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const MONTHS_OPTIONS = [
    { value: 'all', label: 'All Months' },
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ];

  const YEARS_OPTIONS = [
    { value: 'all', label: 'All Years' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
  ];

  const PAYMENT_FILTER_OPTIONS = [
    { value: 'all', label: 'All Payments' },
    ...PAYMENT_METHODS,
  ];

  const isAnyFilterActive = useMemo(() => {
    return (
      filters.type !== 'all' ||
      filters.categoryId !== 'all' ||
      filters.dateRange !== 'all' ||
      filters.search !== '' ||
      filters.month !== 'all' ||
      filters.year !== 'all' ||
      filters.amountMin !== '' ||
      filters.amountMax !== '' ||
      filters.paymentMethod !== 'all'
    );
  }, [filters]);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Search and Advanced Filters Panel */}
      <Card className="p-4 md:p-6" title="Ledger Search & Filters">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <FaSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search transaction title, desc, notes..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <Button
              variant="primary"
              onClick={handleOpenAdd}
              className="py-2 px-4 shadow-sm shrink-0 bg-blue-600 hover:bg-blue-700 font-semibold"
            >
              <FaPlus className="w-4 h-4 mr-1" /> Add Transaction
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <Select
              id="filter-type"
              placeholder="All Types"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' },
              ]}
            />

            <Select
              id="filter-category"
              placeholder="All Categories"
              value={filters.categoryId}
              onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              options={filterCategoryOptions}
            />

            <Select
              id="filter-month"
              placeholder="All Months"
              value={filters.month}
              onChange={(e) => handleFilterChange('month', e.target.value)}
              options={MONTHS_OPTIONS}
            />

            <Select
              id="filter-year"
              placeholder="All Years"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              options={YEARS_OPTIONS}
            />

            <Select
              id="filter-payment"
              placeholder="All Payments"
              value={filters.paymentMethod}
              onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
              options={PAYMENT_FILTER_OPTIONS}
            />
          </div>

          {/* Expanded filters row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-50 dark:border-slate-850">
            <Select
              id="filter-daterange"
              placeholder="All Dates"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              options={[
                { value: 'all', label: 'All Dates' },
                { value: 'week', label: 'Last 7 Days' },
                { value: 'month', label: 'Last 30 Days' },
                { value: 'custom', label: 'Custom Date Range' },
              ]}
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Amount"
                value={filters.amountMin}
                onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max Amount"
                value={filters.amountMax}
                onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <Select
              id="filter-sort"
              placeholder="Sort By"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              options={[
                { value: 'date-desc', label: 'Date: Newest First' },
                { value: 'date-asc', label: 'Date: Oldest First' },
                { value: 'amount-desc', label: 'Amount: Highest First' },
                { value: 'amount-asc', label: 'Amount: Lowest First' },
              ]}
            />
          </div>

          {filters.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 max-w-md">
              <Input
                id="filter-start-date"
                label="Start Date"
                type="date"
                value={filters.customStartDate}
                onChange={(e) => handleFilterChange('customStartDate', e.target.value)}
              />
              <Input
                id="filter-end-date"
                label="End Date"
                type="date"
                value={filters.customEndDate}
                onChange={(e) => handleFilterChange('customEndDate', e.target.value)}
              />
            </div>
          )}
          
          {isAnyFilterActive && (
            <div className="flex justify-start">
              <button
                onClick={() => dispatch(resetFilters())}
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1.5 outline-none hover:underline"
              >
                <FaTimes className="w-3.5 h-3.5" /> Clear active filters
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Ledger Cards Table */}
      <Card title="Ledger Entries" description={`Showing ${filteredTransactions.length} transaction logs`}>
        {filteredTransactions.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <FaCoins className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-800" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No matching records found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Title / Details</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Payment</th>
                    <th className="pb-3 pr-4 text-right">Amount</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                  {paginatedTransactions.map((tx) => {
                    const cat = categoriesMap[tx.categoryId] || { name: 'Others', color: '#94a3b8' };
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group animate-fadeIn">
                        <td className="py-3.5 text-slate-450 whitespace-nowrap">
                          {formatDate(tx.date)}
                        </td>
                        <td className="py-3.5 pr-4 truncate max-w-xs">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200">{tx.title}</h4>
                          {tx.description && <p className="text-[10px] text-slate-450 mt-0.5 truncate">{tx.description}</p>}
                        </td>
                        <td className="py-3.5 pr-4">
                          <Badge variant={tx.type === 'income' ? 'success' : 'danger'}>
                            {tx.type === 'income' ? 'Income' : 'Expense'}
                          </Badge>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                            <span className="text-slate-650 dark:text-slate-400">{cat.name}</span>
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-slate-500 whitespace-nowrap uppercase text-[10px] tracking-wide font-semibold">
                          {tx.paymentMethod || 'Cash'}
                        </td>
                        <td className={`py-3.5 text-right font-extrabold pr-4 ${
                          tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                        </td>
                        <td className="py-3.5 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleDuplicate(tx.id)}
                              title="Duplicate Entry"
                              className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              <FaCopy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(tx)}
                              title="Edit Entry"
                              className="text-slate-400 hover:text-indigo-655 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              <FaEdit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(tx.id)}
                              title="Delete Entry"
                              className="text-slate-400 hover:text-rose-650 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              <FaTrashAlt className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400">
                  Page {currentPage} of {totalPages} ({filteredTransactions.length} items)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    <FaChevronLeft className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    <FaChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Save Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-850 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setFormType('expense');
                setFormCategory('');
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                formType === 'expense'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm'
                  : 'text-slate-550'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setFormType('income');
                setFormCategory('');
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                formType === 'income'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm'
                  : 'text-slate-550'
              }`}
            >
              Income
            </button>
          </div>

          <Input
            id="form-title"
            label="Transaction Title"
            placeholder="e.g. Salary, Rent, Grocery shopping details"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="form-amount"
              label="Amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              required
            />

            <Select
              id="form-category"
              label="Category"
              placeholder="Select category"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              options={formCategoryOptions}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              id="form-payment"
              label="Payment Method"
              placeholder="Select method"
              value={formPaymentMethod}
              onChange={(e) => setFormPaymentMethod(e.target.value)}
              options={PAYMENT_METHODS}
              required
            />

            <Input
              id="form-date"
              label="Date"
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              required
            />
          </div>

          <Input
            id="form-desc"
            label="Description"
            placeholder="e.g. Weekly vegetable run details"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            maxLength={100}
          />

          <div className="space-y-1">
            <label htmlFor="form-notes" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Detailed Notes
            </label>
            <textarea
              id="form-notes"
              placeholder="Add long form explanations, codes, or tags..."
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              maxLength={250}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[70px] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={formType === 'expense' ? 'danger' : 'primary'}
              isLoading={isSubmitting}
            >
              {editingTransaction ? 'Save Changes' : 'Create Transaction'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default TransactionsPage;
