'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  cnic: string;
  password: string;
  password2: string;
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      setFieldErrors({});

      await registerUser(data);
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData && typeof errorData === 'object' && !errorData.detail) {
        setFieldErrors(errorData);
      } else {
        setError(errorData?.detail || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex flex-col md:flex-row bg-white relative">
        {/* Left Panel */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-green-900 clip-diagonal z-0"></div>
          <div className="relative z-10 p-12 text-white flex flex-col justify-between w-full">
            <div>
              <h1 className="text-4xl font-bold mb-4">🎓 Join Our Community</h1>
              <p className="text-lg mb-8">Start your academic journey today</p>
              <div className="bg-white/10 backdrop-blur p-3 rounded-xl shadow-md max-w-xs">
                <h2 className="text-base font-semibold mb-2">Application Steps</h2>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Create account', 'Complete profile', 'Select program', 'Submit application'].map((step, i) => (
                      <div className="flex items-center" key={i}>
                        <div className="flex h-4 w-4 rounded-full bg-green-600 text-white items-center justify-center mr-1 shrink-0">{i + 1}</div>
                        <span>{step}</span>
                      </div>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/landing" className="text-sm flex items-center text-green-200 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Homepage
            </Link>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16 bg-white z-10">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
              <p className="text-sm text-gray-600 mt-2">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-green-700 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {['first_name', 'last_name'].map((field) => (
                      <div key={field}>
                        <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                          {field.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())}
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <input
                              id={field}
                              type="text"
                              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-green-600 focus:outline-none"
                              placeholder={field === 'first_name' ? 'John' : 'Doe'}
                              {...register(field as keyof RegisterData, {
                                required: `${field.replace('_', ' ')} is required`,
                              })}
                          />
                        </div>
                        {(errors[field as keyof RegisterData] || fieldErrors[field]) && (
                            <p className="text-xs text-red-600 mt-1">
                              {errors[field as keyof RegisterData]?.message || fieldErrors[field]?.[0]}
                            </p>
                        )}
                      </div>
                  ))}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-green-600 focus:outline-none"
                        placeholder="you@example.com"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                    />
                  </div>
                  {(errors.email || fieldErrors.email) && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.email?.message || fieldErrors.email?.[0]}
                      </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        id="phone_number"
                        type="tel"
                        className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-green-600 focus:outline-none"
                        placeholder="+1 (555) 123-4567"
                        {...register('phone_number', {
                          required: 'Phone number is required',
                        })}
                    />
                  </div>
                  {(errors.phone_number || fieldErrors.phone_number) && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.phone_number?.message || fieldErrors.phone_number?.[0]}
                      </p>
                  )}
                </div>

                {/* CNIC */}
                <div>
                  <label htmlFor="cnic" className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        id="cnic"
                        type="text"
                        className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-green-600 focus:outline-none"
                        placeholder="12345-1234567-1"
                        {...register('cnic', {
                          required: 'CNIC is required',
                        })}
                    />
                  </div>
                  {(errors.cnic || fieldErrors.cnic) && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.cnic?.message || fieldErrors.cnic?.[0]}
                      </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-green-600 focus:outline-none"
                        placeholder="••••••••"
                        {...register('password', {
                          required: 'Password is required',
                          minLength: { value: 8, message: 'Password must be at least 8 characters' },
                        })}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {(errors.password || fieldErrors.password) && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.password?.message || fieldErrors.password?.[0]}
                      </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        id="password2"
                        type={showPassword2 ? 'text' : 'password'}
                        className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-green-600 focus:outline-none"
                        placeholder="••••••••"
                        {...register('password2', {
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match',
                        })}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword2(!showPassword2)}
                    >
                      {showPassword2 ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {(errors.password2 || fieldErrors.password2) && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.password2?.message || fieldErrors.password2?.[0]}
                      </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition duration-200 flex items-center justify-center"
                >
                  {isLoading ? <LoadingSpinner size="small" /> : 'Create Account'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link href="/landing" className="text-sm text-gray-600 hover:text-green-700">
                  <ArrowLeft className="inline h-4 w-4 mr-1" />
                  Back to homepage
                </Link>
              </div>
            </form>
          </div>
        </div>

        <style jsx>{`
        .clip-diagonal {
          clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
        }
      `}</style>
      </div>
  );
}
