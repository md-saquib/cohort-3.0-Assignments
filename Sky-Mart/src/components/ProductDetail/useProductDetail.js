import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addToCartQty } from '../../features/cart/cartSlice'
import { selectProductById } from '../../features/data/dataSlice'
import { useToast } from '../../hooks/useToast'

export default function useProductDetail(productId) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { triggerToast } = useToast()
    const [quantity, setQuantity] = useState(1)

    // Reset quantity when shifting between products
    useEffect(() => {
        setQuantity(1)
    }, [productId])

    const products = useSelector((state) => state.data.items)
    const product = useSelector((state) => selectProductById(state, productId))

    const cartItems = useSelector((state) => state.cart.items)
    const isInCart = cartItems.some((item) => String(item.product.id) === String(productId))

    const currentIndex = products.findIndex((p) => String(p.id) === String(productId))
    const prevProductId = currentIndex > 0 ? products[currentIndex - 1].id : null
    const nextProductId = currentIndex < products.length - 1 && currentIndex !== -1 ? products[currentIndex + 1].id : null

    const handleIncrement = () => {
        if (isInCart) return
        setQuantity((q) => q + 1)
    }

    const handleDecrement = () => {
        if (isInCart) return
        setQuantity((q) => Math.max(1, q - 1))
    }

    const handleAddToCart = () => {
        if (!product || isInCart) return
        dispatch(addToCartQty({ product, quantity }))
        triggerToast(`✅ Added ${quantity} × ${product.name} to cart!`, 'success')
    }

    const handlePrev = () => {
        if (prevProductId) {
            navigate(`/product/${prevProductId}`)
        }
    }

    const handleNext = () => {
        if (nextProductId) {
            navigate(`/product/${nextProductId}`)
        }
    }

    return {
        product,
        quantity,
        isInCart,
        hasPrev: prevProductId !== null,
        hasNext: nextProductId !== null,
        onIncrement: handleIncrement,
        onDecrement: handleDecrement,
        onAddToCart: handleAddToCart,
        onPrev: handlePrev,
        onNext: handleNext,
    }
}
