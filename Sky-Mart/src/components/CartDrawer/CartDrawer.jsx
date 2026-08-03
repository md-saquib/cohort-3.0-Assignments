import { X, ShoppingBag, ShoppingCart } from 'lucide-react'
import useCartDrawer from './useCartDrawer'
import { formatPrice } from '../../utils/formatters'

export default function CartDrawer({ isOpen, onClose }) {
    const {
        cartItems,
        total,
        itemCount,
        onIncrement,
        onDecrement,
        onRemove,
        onClear,
    } = useCartDrawer()

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <aside
                className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-neutral-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-neutral-800 dark:bg-neutral-950 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
                    <div className="flex items-center gap-2 text-xl font-black text-neutral-900 dark:text-white">
                        <ShoppingCart size={20} className="text-lime-500" />
                        <span>Cart</span>
                        <span className="rounded-full bg-lime-500 px-2 py-0.5 text-xs text-neutral-900 font-bold">
                            {itemCount}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full border border-neutral-300 p-2 text-neutral-500 hover:text-neutral-950 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-white"
                        aria-label="Close cart"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Items list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <ShoppingBag className="mb-4 text-lime-500" size={48} />
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Your cart is empty</h3>
                            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                                Add a few products and they’ll show up here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.product.id}
                                    className="flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    <div className="h-20 w-20 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-lime-100 to-emerald-100 text-3xl font-black text-lime-700 dark:from-lime-900/40 dark:to-emerald-950/40">
                                        ⚡
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                                                {item.product.name}
                                            </p>
                                            <button
                                                onClick={() => onRemove(item.product.id)}
                                                className="text-neutral-400 hover:text-red-500 transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <p className="mt-1 text-sm text-lime-600 dark:text-lime-400 font-medium">
                                            {formatPrice(item.product.price)} each
                                        </p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center rounded-full border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-950">
                                                <button
                                                    onClick={() => onDecrement(item.product.id)}
                                                    className="px-2.5 py-1 text-lg font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                                                    aria-label="Decrement quantity"
                                                >
                                                    −
                                                </button>
                                                <span className="min-w-8 text-center text-sm font-bold text-neutral-900 dark:text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => onIncrement(item.product)}
                                                    className="px-2.5 py-1 text-lg font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                                                    aria-label="Increment quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="text-sm font-extrabold text-neutral-900 dark:text-white">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer summary */}
                {cartItems.length > 0 && (
                    <div className="border-t border-neutral-200 p-4 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
                        <div className="mb-4 flex items-center justify-between text-lg font-bold text-neutral-900 dark:text-white">
                            <span>Subtotal</span>
                            <span className="text-lime-600 dark:text-lime-400">{formatPrice(total)}</span>
                        </div>
                        <button
                            type="button"
                            className="w-full cursor-pointer rounded-xl bg-lime-500 py-3 text-base font-bold text-neutral-900 shadow-md shadow-lime-500/25 transition hover:bg-lime-400 active:scale-[0.98]"
                        >
                            Checkout
                        </button>
                        <button
                            onClick={onClear}
                            className="mt-3 block w-full text-center text-sm font-medium text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 transition-colors"
                        >
                            Clear cart
                        </button>
                    </div>
                )}
            </aside>
        </>
    )
}
