import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { buildReturnPath } from '../utils/authRedirect';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, googleLogin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isAdminLogin = searchParams.get('redirect') === '/admin' || location.state?.adminRequired;
  const redirectTo = searchParams.get('redirect') || buildReturnPath(location.state?.from);
  const forbiddenAccess = searchParams.get('forbidden') === 'admin';
  const authMessage = location.state?.message;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const redirectAfterLogin = async (authData) => {
    if (authData.user.role === 'admin') {
      toast.success('Admin login successful!');
      navigate('/admin', { replace: true });
      return;
    }

    if (isAdminLogin) {
      await logout();
      setError('You do not have admin access.');
      return;
    }

    toast.success('Login successful!');
    navigate(redirectTo);
  };

  const handleGoogleSuccess = async () => {
    try {
      const authData = await googleLogin();
      await redirectAfterLogin(authData);
    } catch {
      toast.error('Google login failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const authData = await login(formData.email, formData.password);
      await redirectAfterLogin(authData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg pt-32 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-white p-8 rounded-lg shadow-lg border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase text-heading tracking-tight mb-2">
            {isAdminLogin ? 'Admin Login' : 'Welcome Back'}
          </h1>
          <p className="text-slate-500">
            {isAdminLogin
              ? 'Sign in with an admin account to manage orders and products'
              : 'Sign in to your account'}
          </p>
        </div>

        {forbiddenAccess && (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-sm border border-amber-100 text-sm mb-6">
            Admin access is required for that page.
          </div>
        )}

        {authMessage && (
          <div className="bg-blue-50 text-blue-800 p-4 rounded-sm border border-blue-100 text-sm mb-6">
            {authMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-sm border border-red-100 text-sm mb-6">
            {error}
          </div>
        )}

        {!isAdminLogin && (
          <>
            <button
              type="button"
              onClick={handleGoogleSuccess}
              className="w-full flex items-center justify-center bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-sm font-bold shadow-sm hover:bg-slate-50 hover:shadow transition-all duration-300 mb-6"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-3" />
              Sign in with Google
            </button>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">Or login with email</span>
              <div className="flex-grow border-t border-slate-200" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-slate-800"
              placeholder={isAdminLogin ? 'admin@example.com' : 'you@company.com'}
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide" htmlFor="password">
                Password
              </label>
              {!isAdminLogin && (
                <a href="#" className="text-sm font-semibold text-brand hover:text-slate-900 transition-colors">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-slate-800"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-white font-bold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-btn-prime hover:bg-hover-prime hover:shadow-brand/30 hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Signing in...' : isAdminLogin ? 'Sign In as Admin' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600 font-medium">
          {isAdminLogin ? (
            <Link to="/" className="text-brand hover:text-slate-900 font-bold uppercase transition-colors">
              Back to website
            </Link>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                state={{ from: location.state?.from, message: authMessage }}
                className="text-brand hover:text-slate-900 font-bold uppercase transition-colors"
              >
                Create an account
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;