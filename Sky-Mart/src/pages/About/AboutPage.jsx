import { Link } from 'react-router-dom'
import { Zap, Users, CheckCircle2, ArrowRight } from 'lucide-react'
import useAboutPage from './useAboutPage'

export default function AboutPage() {
    const { stats, values, team } = useAboutPage()

    return (
        <div className="space-y-10 pb-12 text-neutral-900 dark:text-white">
            {/* Hero Section */}
            <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-500 text-neutral-950 shadow-lg shadow-lime-500/20 dark:shadow-neutral-950/20">
                    <Zap className="h-7 w-7" />
                </div>
                <h1 className="text-4xl font-black">
                    About <span className="text-lime-500">SkyMart</span>
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300">
                    SkyMart is a next-generation e-commerce platform built to make online shopping fast, fair, and enjoyable — for everyone.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {stats.map((item) => (
                    <div key={item.label} className="rounded-3xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
                        <p className="text-3xl font-black text-lime-600 dark:text-lime-400">{item.value}</p>
                        <p className="mt-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{item.label}</p>
                    </div>
                ))}
            </div>

            {/* Our Story */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
                <h2 className="text-2xl font-black text-neutral-950 dark:text-white sm:text-3xl">Our Story</h2>
                <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
                    SkyMart began in 2022 as a side project by two engineers who were frustrated by bloated, slow e-commerce experiences and wanted to build something cleaner, smarter, and more human. Over the years, we've expanded our curated collections while remaining true to our core metrics of community feedback and checkout speed.
                </p>
            </div>

            {/* Core Values */}
            <div className="grid gap-6 md:grid-cols-3">
                {values.map((val) => (
                    <div key={val.title} className="rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-lime-500/10 text-lime-600 dark:bg-lime-500/20 dark:text-lime-400">
                                {val.icon === 'users' ? (
                                    <Users size={20} />
                                ) : val.icon === 'check' ? (
                                    <CheckCircle2 size={20} />
                                ) : (
                                    <Zap size={20} />
                                )}
                            </div>
                            <h3 className="text-lg font-black text-neutral-900 dark:text-white">{val.title}</h3>
                            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                {val.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Team Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-black text-neutral-950 dark:text-white sm:text-3xl">Meet the Team</h2>
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    {team.map((person) => (
                        <div key={person.name} className="rounded-3xl border border-neutral-200 bg-white p-5 text-center dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
                            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-xl font-black ${person.color}`}>
                                {person.name[0]}
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{person.name}</h3>
                            <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{person.role}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Action Callout */}
            <div className="rounded-3xl bg-lime-500 p-8 text-neutral-950 shadow-lg shadow-lime-500/20 dark:shadow-neutral-950/10">
                <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
                    <div>
                        <h3 className="text-2xl font-black sm:text-3xl">Ready to shop?</h3>
                        <p className="mt-2 text-sm font-medium text-neutral-900/80">
                            Find the pieces that bring your day to life.
                        </p>
                    </div>
                    <Link
                        to="/products"
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 active:scale-95"
                    >
                        <span>Browse Products</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    )
}
