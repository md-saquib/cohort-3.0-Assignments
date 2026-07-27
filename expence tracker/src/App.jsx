import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { checkSession } from './feature/authSlice';
import AppRoutes from './routes/AppRoutes';
import Spinner from './components/ui/Spinner';

export const App = () => {
  const dispatch = useDispatch();
  const { user, isInitialized } = useSelector((state) => state.auth);

  // Check auth session on mount
  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  // Sync theme class from user profile settings directly
  useEffect(() => {
    if (user?.settings?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-indigo-650">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
