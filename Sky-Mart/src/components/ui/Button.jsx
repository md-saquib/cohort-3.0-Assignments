export default function Button({ children, type = 'button', variant = 'primary', className = '', disabled = false, ...props }) {
    const base = 'inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

    const variants = {
        primary: 'bg-lime-500 text-neutral-900 hover:bg-lime-400 focus:ring-lime-500',
        secondary: 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700',
        ghost: 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800',
    }

    return (
        <button type={type} disabled={disabled} className={`${base} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    )
}
