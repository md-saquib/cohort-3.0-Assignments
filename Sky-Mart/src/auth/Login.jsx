import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { loginUser } from "../controller/AuthController";
import { contextData } from "../context/ContextProvider";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = contextData();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        let response = loginUser(data)
        if (response.status) {
            setUser(response.data);
            navigate('/')
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
                    Welcome Back
                </h1>

                <p className="mb-8 text-center text-gray-500">
                    Login to your account
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="mb-2 block font-medium text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className={`w-full rounded-lg border px-4 py-3 outline-none transition
                ${errors.email
                                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                    : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                }`}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value:
                                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            })}
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block font-medium text-gray-700">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className={`w-full rounded-lg border px-4 py-3 pr-12 outline-none transition
                  ${errors.password
                                        ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    }`}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>



                    {/* Button */}
                    <button
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-500">
                    Don't have an account?{" "}
                    <NavLink
                        to="/register"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Register
                    </NavLink>
                </p>
            </div>
        </div>
    );
};

export default Login;