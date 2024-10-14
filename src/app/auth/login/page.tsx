'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { LoginData } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ArrowLeft, Mail, Lock, Megaphone, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex flex-col md:flex-row bg-white relative">
        {/* Left Panel - Diagonal Blue Background */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-green-900 clip-diagonal z-0"></div>
          <div className="relative z-10 p-12 text-white flex flex-col justify-between w-full">
            <div>
              <h1 className="text-4xl font-bold mb-4">Admission Portal</h1>
              <p className="text-lg mb-8">Welcome to your future</p>
              <div className="bg-white/10 backdrop-blur p-3 rounded-xl shadow-md">
                <h2 className="text-base font-semibold">Key Dates</h2>
                <div className="text-xs flex justify-between">
                  <div>📝 Apply by: Aug 20</div>
                  <div>🧪 Test: Sep 5</div>
                </div>
              </div>
            </div>
            <Link href="/landing" className="text-sm flex items-center text-green-200 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Homepage
            </Link>
          </div>
        </div>

        {/* Right Panel - Login + Announcement */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16 bg-white z-10">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
              <p className="text-sm text-gray-600 mt-2">
                Or{' '}
                <Link href="/auth/register" className="text-green-700 hover:underline">
                  register a new account
                </Link>
              </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                      id="email"
                      type="email"
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
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-green-600 focus:outline-none"
                      placeholder="••••••••"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
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
                {errors.password && (
                    <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="h-4 w-4 text-green-600 border-gray-300 rounded" />
                  <span>Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-green-700 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition duration-200 flex items-center justify-center"
              >
                {isLoading ? <LoadingSpinner size="small" /> : 'Sign in'}
              </button>
            </form>

            {/* Announcement Card */}
            {/*<div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4">*/}
            {/*  <div className="flex items-center mb-2">*/}
            {/*    <Megaphone className="h-5 w-5 text-blue-600 mr-2" />*/}
            {/*    <h3 className="text-sm font-semibold text-gray-800">Latest Announcements</h3>*/}
            {/*  </div>*/}
            {/*  <ul className="text-sm text-gray-700 space-y-1 max-h-32 overflow-y-auto">*/}
            {/*    <li>📅 Admissions open July 24</li>*/}
            {/*    <li>🧾 Entrance test: August 5</li>*/}
            {/*    <li>🎓 Orientation: Sept 10</li>*/}
            {/*    <li>💼 Career fair: October 20</li>*/}
            {/*  </ul>*/}
            {/*</div>*/}
          </div>
        </div>

        {/* Custom CSS for diagonal */}
        <style jsx>{`
        .clip-diagonal {
          clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
        }
      `}</style>
      </div>
  );
}