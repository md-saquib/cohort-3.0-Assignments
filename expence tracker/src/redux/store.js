import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../feature/authSlice';
import transactionReducer from '../feature/transactionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
