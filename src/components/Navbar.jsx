import React, { useState, useEffect, useCallback } from 'react';
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

const DESKTOP_BREAKPOINT = 1024;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        closeMenu();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [closeMenu]);

  const isHome = location.pathname === '/';
  const isSolidNav = isScrolled || isOpen;
  const useLightText = isSolidNav || isHome;

  const navLinkClass = (isActive) =>
    `text-sm font-bold uppercase tracking-wider transition-colors duration-200 whitespace-nowrap ${
      isActive
        ? 'text-brand'
        : useLightText
        ? 'text-gray-200 hover:text-white'
        : 'text-nav-bg hover:text-brand'
    }`;

  const mobileNavLinkClass = (isActive) =>
    `flex items-center min-h-[48px] px-4 py-3 text-base font-bold uppercase tracking-wide border-b border-slate-800 transition-colors ${
      isActive
        ? 'text-brand bg-slate-800/40'
        : 'text-gray-300 hover:text-white hover:bg-slate-800'
    }`;

  const brandTextClass = useLightText ? 'text-white' : 'text-slate-900';

  const navSurfaceClass = isSolidNav
    ? 'bg-nav-bg/95 backdrop-blur-md shadow-lg py-2.5 sm:py-3 lg:py-4'
    : isHome
    ? 'bg-gradient-to-b from-black/50 via-black/20 to-transparent backdrop-blur-sm py-3 sm:py-4 lg:py-5'
    : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/70 py-2.5 sm:py-3 lg:py-4';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 overflow-x-hidden pt-[env(safe-area-inset-top,0px)] ${navSurfaceClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center gap-4">
            {/* Logo and Brand Text */}
            <NavLink to="/" className="flex items-center gap-3 shrink-0">
              <img
                src="https://i.ibb.co.com/WvftM2PT/0cf3a8dc-3aca-48a2-b51d-1419aa33f4a5.jpg"
                alt="Crane Parts & Tarpaulin Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-md shadow-sm shrink-0"
              />
              <div className="leading-tight flex flex-col sm:flex-row sm:gap-1">
                <span className={`text-base sm:text-xl font-black tracking-tighter uppercase ${brandTextClass}`}>
                  Crane Parts &
                </span>
                <span className="text-base sm:text-xl font-black tracking-tighter uppercase text-brand">
                  Tarpaulin
                </span>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-4 lg:gap-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.title}
                    to={link.path}
                    className={({ isActive }) => navLinkClass(isActive)}
                  >
                    {link.title}
                  </NavLink>
                ))}
              </div>

              <div className="flex items-center gap-4 shrink-0 border-l border-slate-600/50 pl-4 ml-2">
                {user ? (
                  <>
                    {isAdmin && (
                      <NavLink
                        to="/admin"
                        className="text-sm font-bold uppercase tracking-wider text-brand hover:text-white transition-colors duration-200 whitespace-nowrap"
                      >
                        Dashboard
                      </NavLink>
                    )}
                    <span
                      className={`hidden xl:inline text-sm font-bold truncate max-w-[150px] ${
                        useLightText ? 'text-gray-200' : 'text-slate-700'
                      }`}
                      title={user.name}
                    >
                      Hi, {user.name?.split(' ')[0] || 'User'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-sm font-bold uppercase text-sm tracking-wider transition-all duration-300 shadow-md whitespace-nowrap"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    className="bg-btn-prime hover:bg-hover-prime text-section-light hover:text-white px-6 py-2.5 rounded-sm font-bold uppercase text-sm tracking-wider transition-all duration-300 shadow-md whitespace-nowrap"
                  >
                    Login
                  </NavLink>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={`p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand transition-colors ${
                  useLightText ? 'text-white' : 'text-nav-bg'
                }`}
                aria-expanded={isOpen}
                aria-controls="mobile-nav-menu"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-nav-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden bg-nav-bg border-t border-slate-800 overflow-hidden"
            >
              <div className="max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top,0px))] overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom,0px)]">
                <div className="px-3 sm:px-4 pt-1 pb-5 sm:pb-6">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.title}
                      to={link.path}
                      className={({ isActive }) => mobileNavLinkClass(isActive)}
                    >
                      {link.title}
                    </NavLink>
                  ))}

                  <div className="pt-4 px-1 flex flex-col gap-3">
                    {user ? (
                      <>
                        <p className="text-center text-sm font-bold text-gray-400 px-2 truncate">
                          Signed in as {user.name?.split(' ')[0] || 'User'}
                        </p>
                        {isAdmin && (
                          <NavLink
                            to="/admin"
                            className="w-full min-h-[48px] flex items-center justify-center bg-brand/20 border border-brand text-brand px-6 py-3 rounded-sm font-bold uppercase text-sm tracking-widest"
                          >
                            Admin Dashboard
                          </NavLink>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            closeMenu();
                            navigate('/');
                          }}
                          className="w-full min-h-[48px] bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-sm font-bold uppercase text-sm tracking-widest transition-colors shadow-md"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <NavLink
                        to="/login"
                        className="w-full min-h-[48px] flex items-center justify-center bg-btn-prime hover:bg-hover-prime text-white px-6 py-3 rounded-sm font-bold uppercase text-sm tracking-widest transition-colors shadow-md"
                      >
                        Login
                      </NavLink>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-label="Close menu"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;