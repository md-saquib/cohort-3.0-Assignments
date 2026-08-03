import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../../features/data/dataSlice'

export default function useProductsPage() {
    const dispatch = useDispatch()
    const { items: products, status } = useSelector((state) => state.data)
    const [searchParams, setSearchParams] = useSearchParams()

    // Sync state directly from URL query parameters
    const search = searchParams.get('search') || ''
    const selectedCategory = searchParams.get('category') || 'all'
    const sortBy = searchParams.get('sort') || 'featured'

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts())
        }
    }, [dispatch, status])

    const setSearch = (value) => {
        const nextParams = new URLSearchParams(searchParams)
        if (value.trim()) {
            nextParams.set('search', value)
        } else {
            nextParams.delete('search')
        }
        setSearchParams(nextParams, { replace: true })
    }

    const setSelectedCategory = (value) => {
        const nextParams = new URLSearchParams(searchParams)
        const val = value.toLowerCase()
        if (val && val !== 'all') {
            nextParams.set('category', val)
        } else {
            nextParams.delete('category')
        }
        setSearchParams(nextParams, { replace: true })
    }

    const setSortBy = (value) => {
        const nextParams = new URLSearchParams(searchParams)
        const val = value.toLowerCase()
        if (val && val !== 'featured') {
            nextParams.set('sort', val)
        } else {
            nextParams.delete('sort')
        }
        setSearchParams(nextParams, { replace: true })
    }

    const handleClearFilters = () => {
        setSearchParams(new URLSearchParams(), { replace: true })
    }

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products]

        // Search Filter
        if (search.trim()) {
            const query = search.toLowerCase()
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query)
            )
        }

        // Category Filter
        if (selectedCategory !== 'all') {
            result = result.filter(
                (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
            )
        }

        // Sorting
        if (sortBy === 'price-low') {
            result.sort((a, b) => a.price - b.price)
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.price - a.price)
        } else if (sortBy === 'rating') {
            result.sort((a, b) => b.rating - a.rating)
        } else if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }

        return result
    }, [products, search, selectedCategory, sortBy])

    return {
        productsCount: products.length,
        filteredProducts: filteredAndSortedProducts,
        status,
        search,
        selectedCategory,
        sortBy,
        setSearch,
        setSelectedCategory,
        setSortBy,
        onClearFilters: handleClearFilters,
    }
}
