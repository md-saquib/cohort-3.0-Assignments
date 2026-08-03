import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProductListItem from './ProductListItem'
import useProductListCard from './useProductListCard'

export default function ProductListCard({ title, icon, items = [], seeAllLink }) {
    const { IconComponent } = useProductListCard(icon)

    return (
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm flex flex-col justify-between h-full">
            <div>
                {/* Header Row */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-4">
                    <div className="flex items-center gap-2 text-neutral-950 dark:text-white">
                        <div className="text-lime-600 dark:text-lime-400">
                            <IconComponent size={18} />
                        </div>
                        <h3 className="font-extrabold text-base sm:text-lg">{title}</h3>
                    </div>
                    {seeAllLink && (
                        <Link
                            to={seeAllLink}
                            className="inline-flex items-center gap-0.5 text-xs font-bold text-lime-600 hover:text-lime-500 dark:text-lime-400 dark:hover:text-lime-300"
                        >
                            <span>See all</span>
                            <ArrowRight size={12} />
                        </Link>
                    )}
                </div>

                {/* Items List */}
                <div className="space-y-3">
                    {items.length === 0 ? (
                        <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
                            No products found
                        </div>
                    ) : (
                        items.map((product) => (
                            <ProductListItem
                                key={product.id}
                                product={product}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
