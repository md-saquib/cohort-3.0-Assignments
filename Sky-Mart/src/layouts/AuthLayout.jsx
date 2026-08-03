import { Link } from 'react-router-dom'

export default function AuthLayout({ title, subtitle, children, footerText, footerLink, footerLinkText }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-8 dark:bg-neutral-950">
            <div className="w-full max-w-md">
                <div className="mb-6 flex items-center justify-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-500 text-lg font-black text-neutral-900">⚡</div>
                    <div className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
                        Sky<span className="text-lime-500">Mart</span>
                    </div>
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/30">
                    <div className="mb-6">
                        <h1 className="text-3xl font-black text-neutral-900 dark:text-white">{title}</h1>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{subtitle}</p>
                    </div>

                    {children}

                    <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
                        {footerText}{' '}
                        <Link to={footerLink} className="font-bold text-lime-500 hover:text-lime-400">
                            {footerLinkText}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
