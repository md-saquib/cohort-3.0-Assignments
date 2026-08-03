import { Laptop, Shirt, Home, Sparkles, Dumbbell, Watch, Package } from 'lucide-react'

const iconMap = {
    Laptop,
    Shirt,
    Home,
    Sparkles,
    Dumbbell,
    Watch,
    Package,
}

export default function CategoryCard({ name, icon, count, bgColor, onClick }) {
    const IconComponent = iconMap[icon] || Package

    return (
        <div
            onClick={onClick}
            className="group flex flex-col items-center justify-center cursor-pointer rounded-3xl border border-neutral-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lime-500/50 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
            role="button"
            aria-label={`View category ${name}`}
        >
            {/* Icon Wrapper */}
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105 ${bgColor}`}>
                <IconComponent size={24} />
            </div>

            {/* Title */}
            <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                {name}
            </h3>

            {/* Item Count */}
            <p className="mt-1 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                {count} {count === 1 ? 'item' : 'items'}
            </p>
        </div>
    )
}
