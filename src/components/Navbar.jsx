import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'Services', path: '/services' },
  { title: 'Products', path: '/products' },
  { title: 'Contact', path: '/contact' },
  { title: 'About Us', path: '/about' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isOpen
          ? 'bg-nav-bg/95 backdrop-blur-md shadow-lg py-4'
          : 'bg-transparent backdrop-blur-md bg-white/5 py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <NavLink to="/" className="flex items-center space-x-3">
              <img src="https://i.ibb.co.com/WvftM2PT/0cf3a8dc-3aca-48a2-b51d-1419aa33f4a5.jpg" alt="Crane Parts & Tarpaulin Logo" className="h-10 md:h-12 w-auto rounded-md shadow-sm" />
              <div className="text-lg md:text-2xl font-black tracking-tighter uppercase">
                <span className={isScrolled || isOpen ? 'text-white' : 'text-slate-900'}>
                  Crane Parts & 
                </span>
                <span className="text-brand"> Tarpaulin</span>
              </div>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.title}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${
                    isActive
                      ? 'text-brand'
                      : isScrolled
                      ? 'text-gray-300 hover:text-white'
                      : 'text-nav-bg hover:text-brand'
                  }`
                }
              >
                {link.title}
              </NavLink>
            ))}
            
            {user ? (
               <div className="flex items-center space-x-4">
                 {(user.email === import.meta.env.VITE_ADMIN_EMAIL || user.email === 'admin@gmail.com') && (
                   <NavLink to="/admin" className="text-sm font-bold uppercase tracking-wider text-brand hover:text-white transition-colors duration-200">
                     Dashboard
                   </NavLink>
                 )}
                 <span className={`text-sm font-bold ${isScrolled ? 'text-gray-200' : 'text-slate-800'}`}>Hi, {user.name?.split(' ')[0] || 'User'}</span>
                 <button onClick={() => { logout(); navigate('/'); }} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-sm font-bold uppercase text-sm tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-red-500/30">
                   Logout
                 </button>
               </div>
            ) : (
              <NavLink to="/login" className="bg-btn-prime hover:bg-hover-prime text-section-light hover:text-white px-6 py-2.5 rounded-sm font-bold uppercase text-sm tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-brand/30">
                Login
              </NavLink>
            )}
            
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none transition-colors duration-300 ${
                isScrolled || isOpen ? 'text-white' : 'text-nav-bg'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-nav-bg border-t border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.title}
                  to={link.path}
                  className={({ isActive }) =>
                    `block px-3 py-4 text-base font-bold uppercase tracking-wide border-b border-slate-800 transition-colors ${
                      isActive
                        ? 'text-brand'
                        : 'text-gray-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  {link.title}
                </NavLink>
              ))}
              <div className="pt-6 flex flex-col space-y-3">
                {user ? (
                   <button onClick={() => { logout(); setIsOpen(false); navigate('/'); }} className="w-full text-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-sm font-bold uppercase text-sm tracking-widest transition-colors duration-300 shadow-md">
                     Logout ({user.name?.split(' ')[0] || 'User'})
                   </button>
                ) : (
                  <NavLink to="/login" className="w-full text-center bg-btn-prime hover:bg-hover-prime text-white px-6 py-3 rounded-sm font-bold uppercase text-sm tracking-widest transition-colors duration-300 shadow-md">
                    Login
                  </NavLink>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;