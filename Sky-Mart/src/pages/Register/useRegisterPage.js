import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser, clearAuthError } from '../../features/auth/authSlice'
import { validateRegister } from '../../features/auth/authValidation'

export default function useRegisterPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [validationErrors, setValidationErrors] = useState({})

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true })
        }
        return () => {
            dispatch(clearAuthError())
        }
    }, [isAuthenticated, navigate, dispatch])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        setValidationErrors((prev) => ({ ...prev, [name]: '' }))
        if (error) dispatch(clearAuthError())
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const errors = validateRegister(form)
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            return
        }

        try {
            await dispatch(registerUser({
                name: form.name,
                email: form.email,
                password: form.password
            })).unwrap()
        } catch {
            // Error is handled in redux state
          }
    }

    return {
        form,
        validationErrors,
        loading,
        error,
        onChange: handleChange,
        onSubmit: handleSubmit,
    }
}
