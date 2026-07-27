import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import { storageService } from './services/storageService';
import './styles/index.css'; // Updated CSS import path
import App from './App.jsx';

// Initialize the database with seeds (if empty) on load
storageService.initialize().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'dark:bg-slate-900 dark:text-slate-100 dark:border dark:border-slate-800 font-sans',
            duration: 3000,
            style: {
              padding: '12px 16px',
              borderRadius: '12px',
            }
          }} 
        />
      </Provider>
    </StrictMode>
  );
});
