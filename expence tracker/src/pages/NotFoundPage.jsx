import React from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { FaExclamationCircle, FaHome } from 'react-icons/fa';
import Button from '../components/ui/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleGoHome = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 font-sans">
      <div className="text-center max-w-md space-y-6">
        <div className="inline-flex p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-full text-indigo-600 dark:text-indigo-400">
          <FaExclamationCircle className="w-16 h-16" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          404 - Page Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="pt-2">
          <Button
            variant="primary"
            onClick={handleGoHome}
            className="w-full font-semibold gap-2 py-2.5 rounded-xl shadow-md shadow-indigo-500/10"
          >
            <FaHome /> Return to Safety
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
