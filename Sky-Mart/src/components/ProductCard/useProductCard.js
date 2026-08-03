import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../features/cart/cartSlice'
import { useToast } from '../../hooks/useToast'

export default function useProductCard(product) {
    const dispatch = useDispatch()
    const { triggerToast } = useToast()
    
    const cartItems = useSelector((state) => state.cart.items)
    const isInCart = cartItems.some((item) => String(item.product.id) === String(product.id))

    const handleAddToCart = (e) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        if (isInCart) return

        dispatch(addToCart(product))
        triggerToast(`✅ ${product.name} added to cart!`, 'success')
    }

    return {
        isInCart,
        onAddToCart: handleAddToCart,
    }
}
