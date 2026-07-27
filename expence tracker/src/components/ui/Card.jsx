import React from 'react';

export const Card = ({
  children,
  title,
  description,
  headerActions,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm shadow-slate-100/40 dark:shadow-none ${className}`}
      {...props}
    >
      {(title || description || headerActions) && (
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {description}
              </p>
            )}
          </div>
          {headerActions && <div className="shrink-0">{headerActions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;
