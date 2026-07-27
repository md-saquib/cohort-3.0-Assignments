import React, { forwardRef } from 'react';

export const Select = forwardRef(({
  label,
  error,
  id,
  options = [],
  className = '',
  required = false,
  helperText,
  placeholder,
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
      
      <select
        id={id}
        ref={ref}
        className={`
          w-full rounded-xl border px-3.5 py-2 text-sm font-sans transition-all duration-200 outline-none
          bg-white dark:bg-slate-900 
          text-slate-900 dark:text-slate-100
          ${error 
            ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' 
            : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:focus:border-indigo-400'
          }
          disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:text-slate-400
        `}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      
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

Select.displayName = 'Select';
export default Select;
