import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectCategoriesWithCounts } from '../../features/data/dataSlice'

export default function useCategoryGrid() {
    const navigate = useNavigate()
    const categories = useSelector(selectCategoriesWithCounts)

    const handleCategoryClick = (categoryName) => {
        // Navigate to catalog with category query parameter
        navigate(`/products?category=${categoryName.toLowerCase()}`)
    }

    // Mapping category names to Lucide icon strings or emojis
    const getCategoryDetails = (name) => {
        const lower = name.toLowerCase()
        if (lower === 'electronics') {
            return { icon: 'Laptop', bgColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' }
        }
        if (lower === 'clothing') {
            return { icon: 'Shirt', bgColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' }
        }
        if (lower === 'furniture') {
            return { icon: 'Home', bgColor: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' }
        }
        if (lower === 'home') {
            return { icon: 'Sparkles', bgColor: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' }
        }
        if (lower === 'sports') {
            return { icon: 'Dumbbell', bgColor: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' }
        }
        if (lower === 'accessories') {
            return { icon: 'Watch', bgColor: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' }
        }
        return { icon: 'Package', bgColor: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900/30 dark:text-neutral-400' }
    }

    const categoriesWithDetails = categories.map((cat) => ({
        ...cat,
        ...getCategoryDetails(cat.name),
    }))

    return {
        categories: categoriesWithDetails,
        onCategoryClick: handleCategoryClick,
    }
}
