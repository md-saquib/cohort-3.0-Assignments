import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../features/theme/themeSlice'

export default function useThemeToggle() {
    const dispatch = useDispatch()
    const { mode } = useSelector((state) => state.theme)

    const handleToggle = () => {
        dispatch(toggleTheme())
    }

    return {
        theme: mode,
        onToggle: handleToggle,
    }
}
