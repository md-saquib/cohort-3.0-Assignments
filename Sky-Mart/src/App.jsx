import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppRoutes from './routes/AppRoutes'
import { fetchProducts } from './features/data/dataSlice'
import Toast from './components/ui/Toast'

function App() {
    const dispatch = useDispatch()
    const { mode } = useSelector((state) => state.theme)

    // Apply dark class to html document element for Tailwind v4 dark mode selector
    useEffect(() => {
        const root = window.document.documentElement
        if (mode === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }, [mode])

    // Pre-fetch products catalog globally on app startup
    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    return (
        <>
            <AppRoutes />
            <Toast />
        </>
    )
}

export default App