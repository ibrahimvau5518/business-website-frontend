import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="relative w-full bg-slate-900 py-24 px-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30" 
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-2/3 mb-10 md:mb-0 z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-6">
            Ready to Upgrade Your <span className="text-brand">Industrial Equipment?</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed mb-8">
            Whether you need a custom sized tarpaulin or heavy-duty crane parts distributed to your site globally, our team is standing by to deliver premium solutions.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/contact" className="bg-brand hover:bg-[#2b9690] text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-brand/30 hover:-translate-y-1 text-center">
              Request a Quote
            </Link>
            <Link to="/products" className="bg-transparent border border-white hover:bg-white hover:text-slate-900 text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest transition-all duration-300 text-center">
              View Catalog
            </Link>
          </div>
        </div>
        
        {/* Decorative Graphic Element */}
        <div className="hidden md:flex md:w-1/3 justify-end z-10">
          <div className="w-48 h-48 border-8 border-brand/30 rounded-full flex items-center justify-center relative">
            <div className="w-32 h-32 border-8 border-brand/60 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-brand rounded-full shadow-[0_0_30px_rgba(58,175,169,0.5)]"></div>
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;