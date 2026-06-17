import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, googleLogin } = useAuth();
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isAdminLogin = searchParams.get('redirect') === '/admin' || location.state?.adminRequired;
  const redirectTo = searchParams.get('redirect') || location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async () => {
    if (isAdminLogin) {
      toast.error('Please use admin email and password to access the dashboard.');
      return;
    }

    try {
      await googleLogin();
      toast.success('Successfully logged in with Google!');
      navigate(redirectTo);
    } catch {
      toast.error('Google Login Error.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isAdminLogin) {
        await adminLogin(formData.email, formData.password);
        toast.success('Admin login successful!');
        navigate('/admin', { replace: true });
      } else {
        await login(formData.email, formData.password);
        toast.success('Login Successful!');
        navigate(redirectTo);
      }
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
              ? 'Sign in with your admin credentials to manage orders'
              : 'Sign in to your account'}
          </p>
        </div>

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
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-slate-800"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
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
              <Link to="/register" className="text-brand hover:text-slate-900 font-bold uppercase transition-colors">
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