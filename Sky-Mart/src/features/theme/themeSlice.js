import { createSlice } from '@reduxjs/toolkit'

const getInitialTheme = () => {
    const saved = localStorage.getItem('skymart_theme')
    if (saved) return saved

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    return systemTheme
}

const initialState = {
    mode: getInitialTheme(),
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.mode = action.payload
            localStorage.setItem('skymart_theme', action.payload)
        },
        toggleTheme: (state) => {
            state.mode = state.mode === 'dark' ? 'light' : 'dark'
            localStorage.setItem('skymart_theme', state.mode)
        },
    },
})

export const { setTheme, toggleTheme } = themeSlice.actions
export default themeSlice.reducer
