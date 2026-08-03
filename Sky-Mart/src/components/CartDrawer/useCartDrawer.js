import { useDispatch, useSelector } from 'react-redux'
import { addToCart, decrementQuantity, removeFromCart, clearCart } from '../../features/cart/cartSlice'

export default function useCartDrawer() {
    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart.items)

    const handleIncrement = (product) => {
        dispatch(addToCart(product))
    }

    const handleDecrement = (productId) => {
        dispatch(decrementQuantity(productId))
    }

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId))
    }

    const handleClear = () => {
        dispatch(clearCart())
    }

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    return {
        cartItems,
        total,
        itemCount,
        onIncrement: handleIncrement,
        onDecrement: handleDecrement,
        onRemove: handleRemove,
        onClear: handleClear,
    }
}
