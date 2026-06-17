import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { buildReturnPath } from '../utils/authRedirect';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = buildReturnPath(location.state?.from);
  const authMessage = location.state?.message;

  const redirectAfterAuth = (authData) => {
    if (authData?.user?.role === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }
    navigate(returnTo, { replace: true });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async () => {
    try {
      const authData = await googleLogin();
      toast.success('Successfully logged in with Google!');
      redirectAfterAuth(authData);
    } catch {
      toast.error('Google Login Error.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');
    
    try {
      const authData = await register(formData.name, formData.email, formData.password);
      toast.success('Registration Successful!');
      redirectAfterAuth(authData);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg pt-32 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-white p-8 rounded-lg shadow-lg border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase text-heading tracking-tight mb-2">Create Account</h1>
          <p className="text-slate-500">Join us to manage your orders</p>
        </div>

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

        <button 
          type="button"
          onClick={handleGoogleSuccess}
          className="w-full flex items-center justify-center bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-sm font-bold shadow-sm hover:bg-slate-50 hover:shadow transition-all duration-300 mb-6"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-3" />
          Sign up with Google
        </button>
        
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase">Or register with email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-slate-800"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2" htmlFor="password">
              Password
            </label>
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

          <div>
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-slate-800"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 mt-4 text-white font-bold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-brand hover:shadow-brand/30 hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600 font-medium">
          Already have an account?{' '}
          <Link
            to="/login"
            state={{ from: location.state?.from, message: authMessage }}
            className="text-brand hover:text-slate-900 font-bold uppercase transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;