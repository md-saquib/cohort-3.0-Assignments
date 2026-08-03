import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ShoppingCart, LogOut } from 'lucide-react'
import ThemeToggle from '../../components/ThemeToggle'
import CartDrawer from '../../components/CartDrawer'
import useMainLayout from './useMainLayout'

export default function MainLayout({ children }) {
    const {
        user,
        isDrawerOpen,
        isMobileMenuOpen,
        cartItemsCount,
        onLogout,
        onOpenCart,
        onCloseCart,
        onToggleMobileMenu,
        onCloseMobileMenu,
    } = useMainLayout()

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-white">
            <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-500 text-lg font-black text-neutral-900">
                            ⚡
                        </div>
                        <div className="text-2xl font-black tracking-tight">
                            Sky<span className="text-lime-500">Mart</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-8 md:flex">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `text-sm font-semibold tracking-wide transition-colors ${isActive
                                    ? 'text-lime-500'
                                    : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white'
                                }`
                            }
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/products"
                            className={({ isActive }) =>
                                `text-sm font-semibold tracking-wide transition-colors ${isActive
                                    ? 'text-lime-500'
                                    : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white'
                                }`
                            }
                        >
                            Products
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `text-sm font-semibold tracking-wide transition-colors ${isActive
                                    ? 'text-lime-500'
                                    : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white'
                                }`
                            }
                        >
                            About
                        </NavLink>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden items-center gap-3 md:flex">
                        <ThemeToggle />

                        {/* User Profile */}
                        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-500 font-extrabold text-neutral-900">
                                {(user?.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-bold truncate max-w-[100px]">{user?.name || 'User'}</span>
                        </div>

                        {/* Cart Toggle */}
                        <button
                            type="button"
                            onClick={onOpenCart}
                            className="relative flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-neutral-300 p-2 text-neutral-700 transition hover:border-lime-500 hover:text-lime-500 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-lime-500 dark:hover:text-lime-500"
                        >
                            <ShoppingCart size={18} />
                            {cartItemsCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-lime-500 px-1 text-[10px] font-black text-neutral-900">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>

                        {/* Logout Button */}
                        <button
                            type="button"
                            onClick={onLogout}
                            className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-neutral-300 p-2 text-neutral-700 hover:border-red-500 hover:text-red-500 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-500 dark:hover:text-red-500"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>

                    {/* Mobile Menu & Cart Row */}
                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeToggle />

                        <button
                            type="button"
                            onClick={onOpenCart}
                            className="relative flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-neutral-300 p-2 text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
                        >
                            <ShoppingCart size={18} />
                            {cartItemsCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-lime-500 px-1 text-[10px] font-black text-neutral-900">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={onToggleMobileMenu}
                            className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-neutral-300 p-2 text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="border-t border-neutral-200 bg-white px-4 py-3 md:hidden dark:border-neutral-800 dark:bg-neutral-950">
                        <nav className="flex flex-col gap-2">
                            <NavLink
                                to="/dashboard"
                                onClick={onCloseMobileMenu}
                                className={({ isActive }) =>
                                    `rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${isActive
                                        ? 'bg-lime-500/10 text-lime-500 dark:bg-lime-500/20'
                                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900'
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/products"
                                onClick={onCloseMobileMenu}
                                className={({ isActive }) =>
                                    `rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${isActive
                                        ? 'bg-lime-500/10 text-lime-500 dark:bg-lime-500/20'
                                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900'
                                    }`
                                }
                            >
                                Products
                            </NavLink>
                            <NavLink
                                to="/about"
                                onClick={onCloseMobileMenu}
                                className={({ isActive }) =>
                                    `rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${isActive
                                        ? 'bg-lime-500/10 text-lime-500 dark:bg-lime-500/20'
                                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900'
                                    }`
                                }
                            >
                                About
                            </NavLink>

                            <hr className="my-2 border-neutral-200 dark:border-neutral-800" />

                            <div className="flex items-center justify-between px-4 py-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-500 font-extrabold text-neutral-900">
                                        {(user?.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold">{user?.name || 'User'}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onCloseMobileMenu()
                                        onLogout()
                                    }}
                                    className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:underline cursor-pointer"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>

            {/* Shopping Cart Drawer overlay */}
            <CartDrawer
                isOpen={isDrawerOpen}
                onClose={onCloseCart}
            />
        </div>
    )
}
