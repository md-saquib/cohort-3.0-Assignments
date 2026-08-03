import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import CategoryCard from './CategoryCard'
import useCategoryGrid from './useCategoryGrid'

export default function CategoryGrid() {
    const { categories, onCategoryClick } = useCategoryGrid()

    return (
        <section className="space-y-6">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-neutral-950 dark:text-white sm:text-2xl">
                        Shop by Category
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Explore products grouped by categories
                    </p>
                </div>
                <Link
                    to="/categories"
                    className="inline-flex items-center gap-1 text-sm font-bold text-lime-600 hover:text-lime-500 dark:text-lime-400 dark:hover:text-lime-300"
                >
                    <span>View All</span>
                    <ArrowRight size={14} />
                </Link>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat) => (
                    <CategoryCard
                        key={cat.name}
                        name={cat.name}
                        icon={cat.icon}
                        count={cat.count}
                        bgColor={cat.bgColor}
                        onClick={() => onCategoryClick(cat.name)}
                    />
                ))}
            </div>
        </section>
    )
}
