export default function Input({ label, error, ...props }) {
    return (
        <label className="block w-full">
            {label && <span className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200">{label}</span>}
            <input
                className={`min-h-[44px] w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:ring-2 focus:ring-lime-500 dark:bg-neutral-800 dark:text-white ${error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300 dark:border-neutral-700'
                    }`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </label>
    )
}
