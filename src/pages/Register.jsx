import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/apiService';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');
    
    try {
      // Direct integration with backend API
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      console.log('Register success:', response);
      alert('Registration Successful! (Testing alert)');
    } catch (err) {
      console.error('Register error:', err);
      // Because we lack a running backend, mock an error
      setError('Registration failed. Backend server might not be running.');
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

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-sm border border-red-100 text-sm mb-6">
            {error}
          </div>
        )}

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
          <Link to="/login" className="text-brand hover:text-slate-900 font-bold uppercase transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;