import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <div className="min-h-screen flex flex-col bg-app-bg text-heading font-sans">
          <Navbar />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={
              <div className="flex flex-col items-center bg-app-bg">
                <BannerSlider />
                
                <div className="flex flex-col items-center pt-20 mb-8 space-y-8 px-4 w-full">
                  <h1 className="text-4xl md:text-5xl font-black text-heading tracking-tight uppercase text-center">Equipment You Can Trust</h1>
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
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout/:productId" element={<Checkout />} />
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
