import { Sun, Moon } from 'lucide-react'
import useThemeToggle from './useThemeToggle'

export default function ThemeToggle() {
    const { theme, onToggle } = useThemeToggle()

    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label="Toggle theme"
            className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-neutral-300 p-2 text-neutral-700 transition hover:border-lime-500 hover:text-lime-500 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-lime-500 dark:hover:text-lime-500"
        >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    )
}
