export default function useAboutPage() {
    const stats = [
        { value: '20K+', label: 'Products' },
        { value: '50K+', label: 'Happy Customers' },
        { value: '4.9', label: 'Avg. Rating' },
        { value: '99%', label: 'On-time Delivery' },
    ]

    const values = [
        {
            title: 'Community',
            description: 'Built around real customer feedback and shared decision-making.',
            icon: 'users',
        },
        {
            title: 'Quality',
            description: 'Curated products without filler or fluff.',
            icon: 'check',
        },
        {
            title: 'Speed',
            description: 'Fast journeys from discovery to checkout.',
            icon: 'zap',
        },
    ]

    const team = [
        { name: 'Ava', role: 'Founder & CEO', color: 'bg-lime-400 text-neutral-950' },
        { name: 'Leo', role: 'Head of Product', color: 'bg-sky-500 text-white' },
        { name: 'Noah', role: 'Lead Engineer', color: 'bg-violet-500 text-white' },
        { name: 'Mia', role: 'Design Director', color: 'bg-pink-500 text-white' },
    ]

    return {
        stats,
        values,
        team,
    }
}
