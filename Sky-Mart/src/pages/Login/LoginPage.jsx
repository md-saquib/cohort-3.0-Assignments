import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import FormError from '../../components/ui/FormError'
import useLoginPage from './useLoginPage'

export default function LoginPage() {
    const {
        form,
        validationErrors,
        loading,
        error,
        onChange,
        onSubmit,
    } = useLoginPage()

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to continue shopping and manage your SkyMart account."
            footerText="Need an account?"
            footerLink="/register"
            footerLinkText="Create one"
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={onChange}
                    error={validationErrors.email}
                    autoComplete="email"
                />

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={onChange}
                    error={validationErrors.password}
                    autoComplete="current-password"
                />

                {(error || validationErrors.submit) && (
                    <FormError message={error || validationErrors.submit} />
                )}

                <Button
                    type="submit"
                    className="w-full cursor-pointer mt-2"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>
        </AuthLayout>
    )
}
