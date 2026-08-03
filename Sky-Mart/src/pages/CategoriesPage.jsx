import CategoryGrid from '../components/CategoryGrid'

export default function CategoriesPage() {
    return (
        <div className="space-y-6 pb-12">
            <div className="text-center sm:text-left">
                <h1 className="text-3xl font-black text-neutral-900 dark:text-white">All Categories</h1>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Browse our collections of quality products
                </p>
            </div>
            <CategoryGrid />
        </div>
    )
}
