import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import themeReducer from '../features/theme/themeSlice'
import dataReducer from '../features/data/dataSlice'
import cartReducer from '../features/cart/cartSlice'
import toastReducer from '../features/toast/toastSlice'

const rootReducer = combineReducers({
    auth: authReducer,
    theme: themeReducer,
    data: dataReducer,
    cart: cartReducer,
    toast: toastReducer,
})

export default rootReducer
