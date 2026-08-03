import { Link } from 'react-router-dom'
import { ShoppingCart, Check } from 'lucide-react'
import useProductListItem from './useProductListItem'
import { formatPrice } from '../../utils/formatters'

export default function ProductListItem({ product }) {
    const { isInCart, onAddToCart } = useProductListItem(product)

    return (
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-lime-500/30 transition-all dark:bg-neutral-950 dark:border-neutral-800 dark:hover:border-lime-500/30">
            {/* Thumbnail */}
            <Link to={`/product/${product.id}`} className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 cursor-pointer block">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`} className="block hover:text-lime-600 dark:hover:text-lime-400 cursor-pointer">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {product.name}
                    </h4>
                </Link>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider mt-0.5">
                    {product.category}
                </p>
            </div>

            {/* Price & Cart CTA */}
            <div className="flex items-center gap-3">
                <span className="text-sm font-extrabold text-neutral-900 dark:text-white">
                    {formatPrice(product.price)}
                </span>
                <button
                    onClick={onAddToCart}
                    disabled={isInCart}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition active:scale-95 cursor-pointer disabled:cursor-not-allowed ${
                        isInCart
                            ? 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600'
                            : 'bg-lime-500 text-neutral-900 hover:bg-lime-400'
                    }`}
                    aria-label={isInCart ? 'Product already in cart' : `Add ${product.name} to cart`}
                >
                    {isInCart ? <Check size={16} /> : <ShoppingCart size={16} />}
                </button>
            </div>
        </div>
    )
}
