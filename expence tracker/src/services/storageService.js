import { SEED_USER, SEED_TRANSACTIONS } from '../data/seedData';

const KEYS = {
  USERS: 'spendwise_users',
  SESSION: 'spendwise_session',
  TRANSACTIONS: 'spendwise_transactions',
};

const LATENCY = 150; // Mock network delay

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getRaw = (key, defaultValue = null) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch (e) {
    console.error(`Storage read error for key ${key}:`, e);
    return defaultValue;
  }
};

const setRaw = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Storage write error for key ${key}:`, e);
    return false;
  }
};

export const storageService = {
  /**
   * Initializes mockup database on application load.
   */
  initialize: async () => {
    const users = getRaw(KEYS.USERS, []);
    if (users.length === 0) {
      setRaw(KEYS.USERS, [SEED_USER]);
      setRaw(KEYS.TRANSACTIONS, SEED_TRANSACTIONS);
      console.log('SpendWise seeded successfully.');
    }
  },

  // USER persistence
  saveUser: async (user) => {
    await sleep(LATENCY);
    const users = getRaw(KEYS.USERS, []);
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    setRaw(KEYS.USERS, users);
    return user;
  },

  getUsersList: async () => {
    await sleep(LATENCY);
    return getRaw(KEYS.USERS, []);
  },

  // SESSION persistence
  saveSession: async (session) => {
    await sleep(LATENCY / 2);
    setRaw(KEYS.SESSION, session);
    return session;
  },

  getSession: async () => {
    await sleep(50);
    return getRaw(KEYS.SESSION, null);
  },

  clearSession: async () => {
    await sleep(50);
    localStorage.removeItem(KEYS.SESSION);
    return true;
  },

  // TRANSACTIONS persistence
  saveTransactions: async (transactions) => {
    await sleep(LATENCY);
    setRaw(KEYS.TRANSACTIONS, transactions);
    return transactions;
  },

  getTransactions: async () => {
    await sleep(LATENCY);
    return getRaw(KEYS.TRANSACTIONS, []);
  },

  clearAllUserData: async (userId) => {
    await sleep(LATENCY);
    const txs = getRaw(KEYS.TRANSACTIONS, []).filter(t => t.userId !== userId);
    setRaw(KEYS.TRANSACTIONS, txs);
    return true;
  },

  // PORTABILITY (Backup & Restore)
  exportBackupData: async (userId) => {
    await sleep(LATENCY);
    return {
      transactions: getRaw(KEYS.TRANSACTIONS, []).filter(t => t.userId === userId),
    };
  },

  importRestoreData: async (userId, backup) => {
    await sleep(LATENCY * 1.5);
    if (!backup || typeof backup !== 'object') {
      throw new Error('Invalid backup file structure');
    }

    if (Array.isArray(backup.transactions)) {
      const rest = getRaw(KEYS.TRANSACTIONS, []).filter(t => t.userId !== userId);
      const imported = backup.transactions.map(t => ({ ...t, userId }));
      setRaw(KEYS.TRANSACTIONS, [...rest, ...imported]);
    }
    return true;
  }
};

export default storageService;
