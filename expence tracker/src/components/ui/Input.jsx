import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  id,
  type = 'text',
  className = '',
  required = false,
  helperText,
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          id={id}
          type={type}
          ref={ref}
          className={`
            w-full rounded-xl border px-3.5 py-2 text-sm font-sans transition-all duration-200 outline-none
            bg-white dark:bg-slate-900 
            text-slate-900 dark:text-slate-100
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
              : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:focus:border-indigo-400'
            }
            placeholder-slate-400 dark:placeholder-slate-500
            disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:text-slate-400
          `}
          {...props}
        />
      </div>
      
      {error && (
        <span className="text-xs text-rose-500 mt-0.5 font-medium">
          {error.message || error}
        </span>
      )}
      
      {!error && helperText && (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
