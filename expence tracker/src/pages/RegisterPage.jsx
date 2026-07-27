import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { FaUser, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import { registerUser, clearAuthError, selectCurrentUser, selectAuthStatus } from '../feature/authSlice';
import { VALIDATION_RULES } from '../utils/validators';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const status = useSelector(selectAuthStatus);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const passwordValue = watch('password');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
    
      await dispatch(registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })).unwrap();
      toast.success('Account created successfully!');
    } catch (err) {
      toast.error(err || 'Registration failed');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Create an Account
        </h2>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Get started today with your private finance tracker.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="register-name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={FaUser}
          error={errors.name}
          {...register('name', VALIDATION_RULES.name)}
        />

        <Input
          id="register-email"
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          icon={FaEnvelope}
          error={errors.email}
          {...register('email', VALIDATION_RULES.email)}
        />

        <Input
          id="register-password"
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={FaLock}
          error={errors.password}
          {...register('password', VALIDATION_RULES.password)}
        />

        <Input
          id="register-confirm-password"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          icon={FaCheckCircle}
          error={errors.confirmPassword}
          {...register('confirmPassword', VALIDATION_RULES.confirmPassword(passwordValue))}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700"
            isLoading={status === 'loading'}
          >
            Create Account
          </Button>
        </div>
      </form>

      <div className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
