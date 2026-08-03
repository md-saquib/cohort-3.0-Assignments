import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { products } from '../../data/products'

export const fetchProducts = createAsyncThunk('data/fetchProducts', async () => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return products.map((product, index) => {
        // Assign distinct mock dates. Index 0 is newest, higher index is older.
        const daysAgo = index * 2
        const date = new Date()
        date.setDate(date.getDate() - daysAgo)
        return {
            ...product,
            createdAt: date.toISOString(),
        }
    })
})

const initialState = {
    items: [],
    status: 'idle',
    error: null,
}

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to fetch products.'
            })
    },
})

// --- Redux Selectors (Memoized via createSelector) ---

// Base input selector that retrieves the raw products array
export const selectProductItems = (state) => state.data.items

// Memoized selector for highest rated products (top 5).
// Inputs: selectProductItems
export const selectTopRatedProducts = createSelector(
    [selectProductItems],
    (items) => {
        return [...items]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
    }
)

// Memoized selector for new arrivals sorting products by creation date (top 5).
// Inputs: selectProductItems
export const selectNewArrivals = createSelector(
    [selectProductItems],
    (items) => {
        return [...items]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
    }
)

// Memoized selector grouping categories and calculating item counts.
// Inputs: selectProductItems
export const selectCategoriesWithCounts = createSelector(
    [selectProductItems],
    (items) => {
        const counts = {}
        items.forEach((item) => {
            counts[item.category] = (counts[item.category] || 0) + 1
        })
        return Object.keys(counts).map((catName) => ({
            name: catName,
            count: counts[catName],
        }))
    }
)

// Memoized selector for related products, excluding current, capped at 4.
// Inputs: selectProductItems, parameter for product ID, parameter for category
export const selectRelatedProducts = createSelector(
    [
        selectProductItems,
        (state, currentProductId) => currentProductId,
        (state, currentProductId, category) => category,
    ],
    (items, currentProductId, category) => {
        if (!category) return []
        return items
            .filter(
                (p) =>
                    p.category.toLowerCase() === category.toLowerCase() &&
                    String(p.id) !== String(currentProductId)
            )
            .slice(0, 4)
    }
)

// Memoized selector to find a product by its unique ID.
// Inputs: selectProductItems, parameter for product ID
export const selectProductById = createSelector(
    [
        selectProductItems,
        (state, productId) => productId,
    ],
    (items, productId) => items.find((p) => String(p.id) === String(productId))
)

export default dataSlice.reducer
