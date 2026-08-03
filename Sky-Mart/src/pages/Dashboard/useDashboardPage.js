import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, selectTopRatedProducts, selectNewArrivals } from '../../features/data/dataSlice'
import { selectCartItemCount, selectCartTotal } from '../../features/cart/cartSlice'

export default function useDashboardPage() {
    const dispatch = useDispatch()

    // Performance optimization: select user name string directly to avoid re-renders on other user object changes
    const userName = useSelector((state) => state.auth.user?.name) || 'Customer'
    const { items: products, status } = useSelector((state) => state.data)

    const topRated = useSelector(selectTopRatedProducts)
    const newArrivals = useSelector(selectNewArrivals)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts())
        }
    }, [dispatch, status])

    const featuredProducts = products.slice(0, 4)

    const count = useSelector(selectCartItemCount)
    const total = useSelector(selectCartTotal)

    return {
        userName,
        featuredProducts,
        topRated,
        newArrivals,
        productsCount: products.length,
        status,
        count,
        total
    }
}
