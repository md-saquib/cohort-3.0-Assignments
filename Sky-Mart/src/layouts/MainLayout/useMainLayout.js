import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../../features/theme/themeSlice'
import { logout } from '../../features/auth/authSlice'
import { openDrawer, closeDrawer } from '../../features/cart/cartSlice'

export default function useMainLayout() {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { mode } = useSelector((state) => state.theme)
    const cartItems = useSelector((state) => state.cart.items)
    const isDrawerOpen = useSelector((state) => state.cart.isDrawerOpen)

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const totalCartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    const handleToggleTheme = () => {
        dispatch(toggleTheme())
    }

    const handleLogout = () => {
        dispatch(logout())
    }

    const handleOpenCart = () => {
        dispatch(openDrawer())
    }

    const handleCloseCart = () => {
        dispatch(closeDrawer())
    }

    const handleToggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev)
    }

    const handleCloseMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    return {
        user,
        themeMode: mode,
        isDrawerOpen,
        isMobileMenuOpen,
        cartItemsCount: totalCartItemsCount,
        onToggleTheme: handleToggleTheme,
        onLogout: handleLogout,
        onOpenCart: handleOpenCart,
        onCloseCart: handleCloseCart,
        onToggleMobileMenu: handleToggleMobileMenu,
        onCloseMobileMenu: handleCloseMobileMenu,
    }
}
