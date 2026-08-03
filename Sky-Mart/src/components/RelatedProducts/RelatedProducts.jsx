import ProductCard from '../ProductCard'
import useRelatedProducts from './useRelatedProducts'

export default function RelatedProducts({ currentProductId, category }) {
    const { relatedProducts } = useRelatedProducts(currentProductId, category)

    if (relatedProducts.length === 0) return null

    return (
        <section className="space-y-6">
            <div>
                <h2 className="text-xl font-black text-neutral-950 dark:text-white sm:text-2xl">
                    Related Products
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    More products in the {category} category you might like
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
    )
}
