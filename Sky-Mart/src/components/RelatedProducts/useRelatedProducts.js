import { useSelector } from 'react-redux'
import { selectRelatedProducts } from '../../features/data/dataSlice'

export default function useRelatedProducts(currentProductId, category) {
    const relatedProducts = useSelector((state) =>
        selectRelatedProducts(state, currentProductId, category)
    )

    return {
        relatedProducts,
    }
}
