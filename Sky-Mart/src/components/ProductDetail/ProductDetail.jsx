import { Star, ShoppingCart, Plus, Minus, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import useProductDetail from './useProductDetail'
import { formatPrice } from '../../utils/formatters'
import Button from '../ui/Button'

export default function ProductDetail({ productId }) {
    const {
        product,
        quantity,
        isInCart,
        hasPrev,
        hasNext,
        onIncrement,
        onDecrement,
        onAddToCart,
        onPrev,
        onNext,
    } = useProductDetail(productId)

    if (!product) {
        return (
            <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
                <p className="text-lg font-bold text-neutral-900 dark:text-white">Product not found</p>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    The item you are looking for may have been removed or is currently unavailable.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Image Section */}
                <div className="overflow-hidden rounded-2xl bg-neutral-50 p-2 dark:bg-neutral-950 flex items-center justify-center border border-neutral-100 dark:border-neutral-800">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full max-h-[380px] w-full rounded-xl object-cover shadow-sm transition-transform duration-300 hover:scale-[1.02]"
                    />
                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-between">
                    <div className="space-y-4">
                        <span className="inline-flex rounded-full bg-lime-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-lime-600 dark:bg-lime-500/20 dark:text-lime-400">
                            {product.category}
                        </span>
                        <h1 className="text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 text-sm">
                            <Star size={16} className="fill-amber-400 text-amber-400" />
                            <span className="font-bold text-neutral-800 dark:text-neutral-200">{product.rating}</span>
                            <span className="text-neutral-400 dark:text-neutral-500">
                                ({product.reviewCount} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="py-2">
                            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Price</p>
                            <p className="text-3xl font-black text-lime-600 dark:text-lime-400 mt-1">
                                {formatPrice(product.price)}
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Description</p>
                            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    </div>

                    {/* Actions and Stock indicators */}
                    <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            {/* Quantity selection */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Quantity</span>
                                <div className={`flex items-center border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-neutral-50 dark:bg-neutral-950 overflow-hidden w-fit ${
                                    isInCart ? 'opacity-50 cursor-not-allowed' : ''
                                }`}>
                                    <button
                                        onClick={onDecrement}
                                        disabled={isInCart}
                                        className="h-11 w-11 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-bold cursor-pointer active:bg-neutral-100 dark:active:bg-neutral-900 disabled:cursor-not-allowed"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-sm font-extrabold text-neutral-900 dark:text-white w-10 text-center select-none">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={onIncrement}
                                        disabled={isInCart}
                                        className="h-11 w-11 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-bold cursor-pointer active:bg-neutral-100 dark:active:bg-neutral-900 disabled:cursor-not-allowed"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart button */}
                            <div className="flex-1 flex flex-col justify-end pt-5 sm:pt-0">
                                <Button
                                    variant={isInCart ? 'secondary' : 'primary'}
                                    onClick={onAddToCart}
                                    disabled={isInCart}
                                    className={`w-full font-bold min-h-[44px] cursor-pointer text-sm flex items-center justify-center gap-2 ${
                                        isInCart
                                            ? 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500 border-none pointer-events-none'
                                            : ''
                                    }`}
                                >
                                    <ShoppingCart size={16} />
                                    {isInCart ? 'Added ✓' : 'Add to Cart'}
                                </Button>
                            </div>
                        </div>

                        {/* Extra indicators */}
                        <div className="grid gap-3 sm:grid-cols-3 pt-2">
                            <div className="flex items-center gap-2 rounded-2xl bg-neutral-50 dark:bg-neutral-950/50 p-3 border border-neutral-100 dark:border-neutral-800">
                                <Truck size={16} className="text-lime-500 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-neutral-800 dark:text-white truncate">Free Delivery</p>
                                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">On orders ₹50+</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl bg-neutral-50 dark:bg-neutral-950/50 p-3 border border-neutral-100 dark:border-neutral-800">
                                <ShieldCheck size={16} className="text-lime-500 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-neutral-800 dark:text-white truncate">Secure Pay</p>
                                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">SSL Protection</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl bg-neutral-50 dark:bg-neutral-950/50 p-3 border border-neutral-100 dark:border-neutral-800">
                                <RefreshCw size={16} className="text-lime-500 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-neutral-800 dark:text-white truncate">Easy Returns</p>
                                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">30-day warranty</p>
                                </div>
                            </div>
                        </div>

                        {/* Adjacent Navigation */}
                        <div className="flex gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <Button
                                variant="secondary"
                                onClick={onPrev}
                                disabled={!hasPrev}
                                className="flex-1 font-bold min-h-[44px] cursor-pointer text-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed text-neutral-700 dark:text-neutral-300"
                            >
                                <span>← Previous</span>
                            </Button>
                            <Button
                                variant="primary"
                                onClick={onNext}
                                disabled={!hasNext}
                                className="flex-1 font-bold min-h-[44px] cursor-pointer text-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed"
                            >
                                <span>Next →</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
