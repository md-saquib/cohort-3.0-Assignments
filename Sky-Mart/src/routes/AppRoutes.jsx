import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoginPage from '../pages/Login'
import RegisterPage from '../pages/Register'
import DashboardPage from '../pages/Dashboard'
import ProductsPage from '../pages/Products'
import ProductDetailPage from '../pages/ProductDetailPage'
import AboutPage from '../pages/About'
import CategoriesPage from '../pages/CategoriesPage'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '../layouts/MainLayout'

export default function AppRoutes() {
    const { isAuthenticated } = useSelector((state) => state.auth)

    return (
        <Routes>
            {/* Root Redirect */}
            <Route
                path="/"
                element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
            />

            {/* Auth Routes */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
            />
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
            />

            {/* Protected Dashboard Page */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <DashboardPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Protected Products Catalog Page */}
            <Route
                path="/products"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ProductsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Protected Product Detail Page */}
            <Route
                path="/product/:id"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ProductDetailPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Protected About Page */}
            <Route
                path="/about"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <AboutPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Protected Categories Page */}
            <Route
                path="/categories"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <CategoriesPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Fallback Catch-All Route */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    )
}
