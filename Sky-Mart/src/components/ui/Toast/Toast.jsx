import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import useToastComponent from './useToastComponent'

export default function Toast() {
    const { message, type, onClose } = useToastComponent()

    if (!message) return null

    const typeStyles = {
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/90 dark:border-emerald-900/50 dark:text-emerald-300',
        error: 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/90 dark:border-rose-900/50 dark:text-rose-300',
        info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/90 dark:border-blue-900/50 dark:text-blue-300',
    }

    const icons = {
        success: <CheckCircle2 size={18} className="text-emerald-500" />,
        error: <AlertCircle size={18} className="text-rose-500" />,
        info: <Info size={18} className="text-blue-500" />,
    }

    return (
        <div className="fixed bottom-5 right-5 z-[100] max-w-sm w-full px-4 sm:px-0">
            <div
                className={`flex items-center gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 ${typeStyles[type]}`}
                role="alert"
            >
                <div className="flex-shrink-0">{icons[type]}</div>
                <div className="flex-1 text-sm font-semibold">{message}</div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 cursor-pointer rounded-full p-1 hover:bg-neutral-800/10 dark:hover:bg-white/10 transition"
                    aria-label="Dismiss notification"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    )
}
