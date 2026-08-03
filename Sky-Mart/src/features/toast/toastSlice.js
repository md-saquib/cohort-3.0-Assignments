import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    message: null,
    type: 'success', // 'success' | 'error' | 'info'
}

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        showToast: (state, action) => {
            state.message = action.payload.message
            state.type = action.payload.type || 'success'
        },
        hideToast: (state) => {
            state.message = null
        },
    },
})

export const { showToast, hideToast } = toastSlice.actions
export default toastSlice.reducer
