import { createSlice, createSelector } from '@reduxjs/toolkit'

const getStoredCart = () => {
    const raw = localStorage.getItem('skymart_cart')
    if (!raw) return []
    try {
        return JSON.parse(raw)
    } catch {
        return []
    }
}

const initialState = {
    items: getStoredCart(),
    isDrawerOpen: false,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload
            const existing = state.items.find((item) => item.product.id === product.id)
            if (existing) {
                existing.quantity += 1
            } else {
                state.items.push({ product, quantity: 1 })
            }
            localStorage.setItem('skymart_cart', JSON.stringify(state.items))
        },
        addToCartQty: (state, action) => {
            const { product, quantity } = action.payload
            const existing = state.items.find((item) => item.product.id === product.id)
            if (existing) {
                existing.quantity += quantity
            } else {
                state.items.push({ product, quantity })
            }
            localStorage.setItem('skymart_cart', JSON.stringify(state.items))
        },
        updateCartQuantity: (state, action) => {
            const { productId, quantity } = action.payload
            const existing = state.items.find((item) => item.product.id === productId)
            if (existing) {
                existing.quantity = Math.max(1, quantity)
            }
            localStorage.setItem('skymart_cart', JSON.stringify(state.items))
        },
        decrementQuantity: (state, action) => {
            const productId = action.payload
            const existing = state.items.find((item) => item.product.id === productId)
            if (existing) {
                if (existing.quantity > 1) {
                    existing.quantity -= 1
                } else {
                    state.items = state.items.filter((item) => item.product.id !== productId)
                }
            }
            localStorage.setItem('skymart_cart', JSON.stringify(state.items))
        },
        removeFromCart: (state, action) => {
            const productId = action.payload
            state.items = state.items.filter((item) => item.product.id !== productId)
            localStorage.setItem('skymart_cart', JSON.stringify(state.items))
        },
        clearCart: (state) => {
            state.items = []
            localStorage.removeItem('skymart_cart')
        },
        openDrawer: (state) => {
            state.isDrawerOpen = true
        },
        closeDrawer: (state) => {
            state.isDrawerOpen = false
        },
        toggleDrawer: (state) => {
            state.isDrawerOpen = !state.isDrawerOpen
        },
    },
})

export const {
    addToCart,
    addToCartQty,
    updateCartQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    openDrawer,
    closeDrawer,
    toggleDrawer,
} = cartSlice.actions

export const selectCartItems = (state) => state.cart.items

// Memoized selector for calculating total item counts in the cart.
// Inputs: selectCartItems
export const selectCartItemCount = createSelector(
    [selectCartItems],
    (items) => items.reduce((sum, item) => sum + item.quantity, 0)
)

// Memoized selector for calculating total cart checkout pricing.
// Inputs: selectCartItems
export const selectCartTotal = createSelector(
    [selectCartItems],
    (items) => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
)

export default cartSlice.reducer
