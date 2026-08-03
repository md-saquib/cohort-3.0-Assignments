import { Link } from 'react-router-dom'
import { ArrowRight, PackageCheck, ShieldCheck, TrendingUp } from 'lucide-react'
import ProductCard from '../../components/ProductCard'
import CategoryGrid from '../../components/CategoryGrid'
import ProductListCard from '../../components/ProductListCard'
import useDashboardPage from './useDashboardPage'

export default function DashboardPage() {
    const {
        userName,
        featuredProducts,
        topRated,
        newArrivals,
        productsCount,
        status,
        count,
        total

    } = useDashboardPage()

    return (
        <div className="grid gap-6 lg:grid-cols-1 pb-10">
            {/* Main Dashboard Content */}
            <div className="space-y-6 lg:col-span-2">
                {/* Banner Section */}
                <section className="rounded-3xl bg-gradient-to-r from-lime-500 via-lime-400 to-emerald-500 p-8 text-neutral-950 shadow-lg shadow-lime-200/40 dark:shadow-neutral-950/20">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-800/80">
                                SkyMart Dashboard
                            </p>
                            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl text-neutral-900">
                                Welcome back, {userName}
                            </h1>
                            <p className="mt-1 text-sm font-medium text-neutral-800/80">
                                Explore our latest deals and top curated products chosen just for you.
                            </p>
                        </div>
                        <Link
                            to="/products"
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 active:scale-95 self-start sm:self-center"
                        >
                            <span>Continue Shopping</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>

                {/* Statistics Row */}
                <section className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                        icon={<PackageCheck size={20} />}
                        label="Items in Store"
                        value={productsCount ? String(productsCount) : '--'}
                        accent="lime"
                    />
                    <StatCard
                        icon={<ShieldCheck size={20} />}
                        label="Secure Checkout"
                        value="Protected"
                        accent="sky"
                    />
                    <StatCard
                        icon={<TrendingUp size={20} />}
                        label="Active Growth"
                        value="+28%"
                        accent="violet"
                    />

                    <StatCard
                        icon={<TrendingUp size={20} />}
                        label="Cart Item"
                        value={count}
                        accent="violet"
                    />
                    <StatCard
                        icon={<TrendingUp size={20} />}
                        label="Cart Total"
                        value={total}
                        accent="violet"
                    />
                </section>

                {/* Shop by Category Section */}
                <CategoryGrid />

                {/* Featured Products */}
                <section className="rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-neutral-950 dark:text-white sm:text-2xl">
                                Featured Products
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Our top picks from the Catalog this week
                            </p>
                        </div>
                        <Link
                            to="/products"
                            className="text-sm font-bold text-lime-600 hover:text-lime-500 dark:text-lime-400 dark:hover:text-lime-300"
                        >
                            View all
                        </Link>
                    </div>

                    {status === 'loading' && featuredProducts.length === 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="animate-pulse rounded-3xl border border-neutral-200 p-5 dark:border-neutral-800">
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
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Top Rated & New Arrivals Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProductListCard
                        title="Top Rated"
                        icon="star"
                        items={topRated}
                        seeAllLink="/products?sort=rating"
                    />
                    <ProductListCard
                        title="New Arrivals"
                        icon="bolt"
                        items={newArrivals}
                        seeAllLink="/products?sort=newest"
                    />
                </div>
            </div>



        </div>
    )
}

function StatCard({ icon, label, value, accent }) {
    const accentStyles = {
        lime: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300',
        sky: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
        violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    }

    return (
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentStyles[accent]}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{label}</p>
                <p className="mt-1 text-2xl font-black text-neutral-900 dark:text-white truncate max-w-[120px]">{value}</p>
            </div>
        </div>
    )
}
