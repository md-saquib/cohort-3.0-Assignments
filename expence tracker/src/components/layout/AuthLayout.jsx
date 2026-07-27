import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FaChartPie, FaLightbulb, FaShieldAlt } from 'react-icons/fa';

const FINANCIAL_TIPS = [
  {
    icon: FaChartPie,
    title: 'Visualize Your Spending',
    desc: 'Understand exactly where your money goes with category breakdowns and real-time graphs.',
  },
  {
    icon: FaLightbulb,
    title: 'Smart Budgets, No Stress',
    desc: 'Set category thresholds and get instant warnings before you overspend.',
  },
  {
    icon: FaShieldAlt,
    title: '100% Client-Side Privacy',
    desc: 'Your financial logs are stored securely in local storage, completely controlled by you.',
  },
];

export const AuthLayout = ({ children }) => {
  const [activeTip, setActiveTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTip((prev) => (prev + 1) % FINANCIAL_TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const TipIcon = FINANCIAL_TIPS[activeTip].icon;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Branding Sidebar - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-600 dark:from-indigo-950 dark:via-indigo-900 dark:to-slate-950 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Glow element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none -translate-x-20 translate-y-20"></div>
        
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <svg className="w-10 h-10 fill-none" viewBox="0 0 24 24">
            <rect width="24" height="24" rx="6" fill="white" fillOpacity="0.15" />
            <path d="M6 17L10 13L14 15L18 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="18" cy="9" r="1.5" fill="white" />
          </svg>
          <span className="text-xl font-extrabold tracking-tight font-sans">
            SpendWise
          </span>
        </div>

        {/* Dynamic Tip Slider */}
        <div className="my-auto relative z-10 max-w-md">
          <div className="transition-all duration-500 transform translate-y-0 opacity-100">
            <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <TipIcon className="w-6 h-6 text-indigo-200" />
            </div>
            <h2 className="text-3xl font-bold font-sans tracking-tight leading-tight">
              {FINANCIAL_TIPS[activeTip].title}
            </h2>
            <p className="mt-4 text-indigo-100 font-sans leading-relaxed text-sm">
              {FINANCIAL_TIPS[activeTip].desc}
            </p>
          </div>
          
          {/* Indicators */}
          <div className="flex gap-2 mt-8">
            {FINANCIAL_TIPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTip(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeTip === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                }`}
                aria-label={`Go to tip ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-indigo-200 font-sans relative z-10">
          © {new Date().getFullYear()} SpendWise Inc. All rights reserved.
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="flex md:hidden items-center gap-2 mb-8 justify-center">
            <svg className="w-8 h-8 fill-none" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="6" fill="#4f46e5" />
              <path d="M6 17L10 13L14 15L18 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-lg font-black tracking-tight text-indigo-600 dark:text-indigo-400">
              SpendWise
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 md:border md:border-slate-100 dark:md:border-slate-800 rounded-3xl p-8 shadow-sm md:shadow-md md:shadow-slate-100/40 dark:shadow-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
