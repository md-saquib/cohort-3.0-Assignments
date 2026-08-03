import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProductDetail from '../components/ProductDetail'
import RelatedProducts from '../components/RelatedProducts'

export default function ProductDetailPage() {
    const { id } = useParams()
    const product = useSelector((state) =>
        state.data.items.find((p) => String(p.id) === String(id))
    )

    return (
        <div className="space-y-10 pb-12">
            <ProductDetail productId={id} />
            {product && (
                <RelatedProducts
                    currentProductId={id}
                    category={product.category}
                />
            )}
        </div>
    )
}
