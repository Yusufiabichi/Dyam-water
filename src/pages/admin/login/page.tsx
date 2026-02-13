
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-800 via-navy-700 to-ocean-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-ocean-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-ocean-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://public.readdy.ai/ai/img_res/0567d353-d7a5-46dc-8fa1-bf10faa1ffe1.png"
            alt="DYAM Natural Water"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-white/60 text-sm mt-1">Sign in to manage your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ri-mail-line text-gray-400"></i>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@dyamwater.com"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="ri-lock-line text-gray-400"></i>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                >
                  <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-gray-400 hover:text-gray-600`}></i>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center">
                  <i className="ri-error-warning-line mr-2"></i>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-ocean-500 to-ocean-600 hover:from-ocean-600 hover:to-ocean-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3.5 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-ocean-50 rounded-lg border border-ocean-100">
            <p className="text-xs text-ocean-700 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-ocean-600">Email: admin@dyamwater.com</p>
            <p className="text-xs text-ocean-600">Password: admin123</p>
          </div>
        </div>

        {/* Back to Website */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-white/70 hover:text-white text-sm transition-colors inline-flex items-center"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
