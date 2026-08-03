import AuthLayout from '../../layouts/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import FormError from '../../components/ui/FormError'
import useRegisterPage from './useRegisterPage'

export default function RegisterPage() {
    const {
        form,
        validationErrors,
        loading,
        error,
        onChange,
        onSubmit,
    } = useRegisterPage()

    return (
        <AuthLayout
            title="Create account"
            subtitle="Start shopping with a fast and secure SkyMart account."
            footerText="Already have an account?"
            footerLink="/login"
            footerLinkText="Log in"
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <Input
                    label="Full Name"
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={onChange}
                    error={validationErrors.name}
                />

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
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={onChange}
                    error={validationErrors.password}
                    autoComplete="new-password"
                />

                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repeat your password"
                    value={form.confirmPassword}
                    onChange={onChange}
                    error={validationErrors.confirmPassword}
                    autoComplete="new-password"
                />

                {(error || validationErrors.submit) && (
                    <FormError message={error || validationErrors.submit} />
                )}

                <Button
                    type="submit"
                    className="w-full cursor-pointer mt-2"
                    disabled={loading}
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </Button>
            </form>
        </AuthLayout>
    )
}
