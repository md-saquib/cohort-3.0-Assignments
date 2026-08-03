import { Search, RotateCcw } from 'lucide-react'
import ProductCard from '../../components/ProductCard'
import useProductsPage from './useProductsPage'
import { categories } from '../../data/products'

export default function ProductsPage() {
    const {
        productsCount,
        filteredProducts,
        status,
        search,
        selectedCategory,
        sortBy,
        setSearch,
        setSelectedCategory,
        setSortBy,
        onClearFilters,
    } = useProductsPage()

    return (
        <div className="space-y-6 pb-12">
            {/* Header and Title */}
            <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-600 dark:text-lime-400">
                    SkyMart Catalog
                </p>
                <h1 className="mt-2 text-3xl font-black text-neutral-900 dark:text-white sm:text-4xl">
                    All Products
                </h1>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Showing {filteredProducts.length} of {productsCount} items
                </p>
            </div>

            {/* Filter and Control Bar */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    {/* Search Field */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products, descriptions..."
                            className="min-h-[44px] w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm text-neutral-900 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-500/25 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
                        />
                    </div>

                    {/* Category Dropdown */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="min-h-[44px] rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-700 outline-none transition focus:border-lime-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat.toLowerCase()}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="min-h-[44px] rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-700 outline-none transition focus:border-lime-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white cursor-pointer"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                        <option value="newest">Newest Arrivals</option>
                    </select>

                    {/* Clear Button */}
                    {(search || selectedCategory !== 'all' || sortBy !== 'featured') && (
                        <button
                            onClick={onClearFilters}
                            className="flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-dashed border-red-300 px-4 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:border-red-900/50 dark:hover:bg-red-950/20"
                        >
                            <RotateCcw size={14} />
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Catalog Grid */}
            {status === 'loading' && filteredProducts.length === 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse rounded-3xl border border-neutral-200 p-5 dark:border-neutral-800">
                            <div className="aspect-square rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
                            <div className="mt-4 h-4 rounded bg-neutral-200 dark:bg-neutral-800" />
                            <div className="mt-2 h-3 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
                            <div className="mt-4 flex items-center justify-between">
                                <div className="h-6 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
                                <div className="h-8 w-12 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
                    <p className="text-xl font-bold text-neutral-900 dark:text-white">No products found</p>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        Try resetting filters or adjusting your search term.
                    </p>
                    <button
                        onClick={onClearFilters}
                        className="mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
