import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/apiService';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Direct integration with backend API
      const response = await loginUser(formData);
      console.log('Login success:', response);
      // Here you would typically save the token & user details to Context/Redux
      alert('Login Successful! (Testing alert)');
    } catch (err) {
      console.error('Login error:', err);
      // Because we lack a running backend, mock an error
      setError('Invalid credentials or backend server is not running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg pt-32 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-white p-8 rounded-lg shadow-lg border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase text-heading tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-500">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-sm border border-red-100 text-sm mb-6">
            {error}
          </div>
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
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-sm font-semibold text-brand hover:text-slate-900 transition-colors">
                Forgot password?
              </a>
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand hover:text-slate-900 font-bold uppercase transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;