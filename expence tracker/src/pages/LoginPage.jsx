import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { loginUser, clearAuthError, selectCurrentUser, selectAuthStatus, selectAuthError } from '../feature/authSlice';
import { VALIDATION_RULES } from '../utils/validators';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const { register, handleSubmit, formState: { errors } } =  useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

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
      const res = await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
      toast.success(`Welcome back, ${res.name}!`);
    } catch (err) {
      toast.error(err || 'Failed to sign in');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Sign in to SpendWise
        </h2>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Enter your details below to access your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="login-email"
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          icon={FaEnvelope}
          error={errors.email}
          {...register('email', VALIDATION_RULES.email)}
        />

        <Input
          id="login-password"
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={FaLock}
          error={errors.password}
          {...register('password', VALIDATION_RULES.password)}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700"
            isLoading={status === 'loading'}
          >
            Sign In
          </Button>
        </div>
      </form>



      <div className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
