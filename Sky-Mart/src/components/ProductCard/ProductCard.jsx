import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'
import useProductCard from './useProductCard'
import { formatPrice } from '../../utils/formatters'
import Button from '../ui/Button'

export default function ProductCard({ product }) {
    const { isInCart, onAddToCart } = useProductCard(product)

    return (
        <article className="group flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-lime-500/50 hover:shadow-xl hover:shadow-lime-500/5 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-lime-500/50">
            {/* Image Container */}
            <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800 block cursor-pointer">
                <span className="absolute left-3 top-3 z-10 rounded-full bg-neutral-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    {product.category}
                </span>
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
            </Link>

            {/* Info Container */}
            <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                    {product.category}
                </p>
                <Link to={`/product/${product.id}`} className="block hover:text-lime-600 dark:hover:text-lime-400 cursor-pointer">
                    <h3 className="mt-2 text-base font-extrabold text-neutral-900 dark:text-white line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{product.rating}</span>
                    <span className="text-xs">({product.reviewCount} reviews)</span>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed flex-1">
                    {product.description}
                </p>

                {/* Pricing & Cart Action */}
                <div className="mt-5 flex items-center justify-between gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Price</span>
                        <span className="text-lg font-black text-neutral-950 dark:text-white">{formatPrice(product.price)}</span>
                    </div>
                    <Button
                        variant={isInCart ? 'secondary' : 'primary'}
                        onClick={onAddToCart}
                        disabled={isInCart}
                        className={`cursor-pointer font-bold px-3 py-2 min-h-[40px] text-xs flex items-center gap-1.5 active:scale-95 ${
                            isInCart
                                ? 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500 border-none pointer-events-none'
                                : ''
                        }`}
                    >
                        <ShoppingCart size={14} />
                        {isInCart ? 'Added ✓' : 'Add'}
                    </Button>
                </div>
            </div>
        </article>
    )
}
