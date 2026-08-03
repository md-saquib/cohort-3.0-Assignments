import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loginRequest, registerRequest } from './authAPI'

const getStoredAuth = () => {
    const raw = localStorage.getItem('skymart_auth')
    if (!raw) return { user: null, token: null }

    try {
        return JSON.parse(raw)
    } catch {
        return { user: null, token: null }
    }
}

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, thunkAPI) => {
    try {
        const response = await loginRequest({ email, password })
        return response
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

export const registerUser = createAsyncThunk('auth/registerUser', async ({ name, email, password }, thunkAPI) => {
    try {
        const response = await registerRequest({ name, email, password })
        return response
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

const initialState = {
    user: getStoredAuth().user,
    token: getStoredAuth().token,
    isAuthenticated: Boolean(getStoredAuth().token),
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.error = null
            localStorage.removeItem('skymart_auth')
        },
        clearAuthError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.token
                state.isAuthenticated = true
                state.error = null
                localStorage.setItem('skymart_auth', JSON.stringify({ user: action.payload.user, token: action.payload.token }))
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'Login failed.'
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.token
                state.isAuthenticated = true
                state.error = null
                localStorage.setItem('skymart_auth', JSON.stringify({ user: action.payload.user, token: action.payload.token }))
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'Registration failed.'
            })
    },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
