import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

interface LoginFormData {
  email: string;
  password: string;
}

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      // Simple authentication - in production, this would connect to a proper auth system
      // For demo purposes, using hardcoded credentials
      if (data.email === 'admin@westgaterealty.com' && data.password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminEmail', data.email);
        onLogin(true);
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-100 to-beige-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full blur-3xl opacity-10 animate-pulse" style={{ background: '#00284b' }}></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full blur-3xl opacity-10 animate-pulse animation-delay-1000" style={{ background: '#c52528' }}></div>

      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8 border-2 border-primary-200 relative z-10">
        <div>
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-white shadow-lg border-4 border-primary-500">
            <img
              src="/assets/images/logo.jpg"
              alt="West Gate Realty"
              className="h-full w-full rounded-full object-cover"
              onError={(e) => {
                // Fallback to icon if logo fails
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.style.backgroundColor = '#00284b';
                  const icon = document.createElement('div');
                  icon.innerHTML = '<svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>';
                  parent.appendChild(icon.firstChild as Node);
                }
              }}
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: '#00284b' }}>
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm font-semibold" style={{ color: '#c52528' }}>
            West Gate Realty Admin Panel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold" style={{ color: '#00284b' }}>
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border-2 border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-all"
                  placeholder="admin@westgaterealty.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold" style={{ color: '#00284b' }}>
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-10 py-3 border-2 border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-all"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 border-l-4" style={{ borderLeftColor: '#c52528' }}>
              <div className="text-sm font-medium" style={{ color: '#c52528' }}>{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: '#00284b',
                background: 'linear-gradient(135deg, #00284b 0%, #00203c 100%)'
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LockClosedIcon className="h-5 w-5 mr-2" />
                  Sign in to Admin Panel
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 mb-3">
              Secure admin access for West Gate Realty Services
            </p>
            <a
              href="/"
              className="text-xs font-medium transition-colors hover:underline"
              style={{ color: '#c52528' }}
            >
              ← Back to Website
            </a>
            <p className="text-xs text-gray-400 mt-3">
              © 2024 West Gate Realty. All rights reserved.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
