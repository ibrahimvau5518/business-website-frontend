import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import ProductIdRedirect from './components/ProductIdRedirect';
import Navbar from './components/Navbar';
import BannerSlider from './components/BannerSlider';
import ProductSection from './components/ProductSection';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <div className="min-h-screen flex flex-col bg-app-bg text-heading font-sans overflow-x-hidden w-full">
          <Navbar />
            
            <main className="flex-grow w-full min-w-0 overflow-x-hidden">
              <Routes>
                <Route path="/" element={
              <div className="flex flex-col items-center bg-app-bg">
                <BannerSlider />
                
                <div className="flex flex-col items-center pt-12 sm:pt-16 md:pt-20 mb-6 sm:mb-8 space-y-6 sm:space-y-8 px-4 w-full max-w-5xl">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-heading tracking-tight uppercase text-center">Equipment You Can Trust</h1>
                  <div className="w-16 h-2 bg-brand rounded mt-8"></div>
                </div>

                <ProductSection />
                
                <Features />
                <Testimonials />
                <CallToAction />
                
              </div>
            } />
            <Route path="/services" element={<Services />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/products/:productId"
              element={<ProtectedRoute><ProductDetails /></ProtectedRoute>}
            />
            <Route
              path="/product/:id"
              element={<ProtectedRoute><ProductIdRedirect /></ProtectedRoute>}
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/checkout/:productId"
              element={<ProtectedRoute><Checkout /></ProtectedRoute>}
            />
            <Route
              path="/payment/:productId"
              element={<ProtectedRoute><Checkout /></ProtectedRoute>}
            />
            <Route
              path="/orders"
              element={<ProtectedRoute><Orders /></ProtectedRoute>}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
