import { Star, Zap, Package } from 'lucide-react'

const iconMap = {
    star: Star,
    bolt: Zap,
}

export default function useProductListCard(iconName) {
    const IconComponent = iconMap[iconName] || Package

    return {
        IconComponent,
    }
}
