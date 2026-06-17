import React, { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-shell bg-app-bg">
      <div className="page-container">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="section-heading mb-4">About Us</h1>
          <div className="w-24 h-1.5 bg-brand mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-16 sm:mb-24 min-w-0">
          <div className="order-2 lg:order-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-heading mb-4 sm:mb-6">Built on Trust & Industrial Excellence</h2>
            <p className="text-slate-600 leading-relaxed mb-4 sm:mb-6 text-base sm:text-lg">
              Established in 1998, Crane Parts & Tarpaulin has grown from a local supplier to a trusted global partner in the heavy machinery sector. We specialize in sourcing the most resilient crane components and fabricating high-grade tarps built for extreme environments.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg">
              Our mission is to minimize operational downtime for our clients by providing fast, reliable, and premium quality industrial solutions. We pride ourselves on our deep technical expertise and uncompromising customer support.
            </p>
            
            <div className="grid grid-cols-2 gap-4 sm:gap-6 border-t border-slate-200 pt-6 sm:pt-8 mt-6 sm:mt-8">
              <div>
                <h4 className="text-3xl sm:text-4xl font-black text-brand mb-2">25+</h4>
                <p className="font-bold text-slate-800 uppercase tracking-widest text-xs sm:text-sm">Years Experience</p>
              </div>
              <div>
                <h4 className="text-3xl sm:text-4xl font-black text-brand mb-2">10k+</h4>
                <p className="font-bold text-slate-800 uppercase tracking-widest text-sm">Products Delivered</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative h-56 sm:h-80 md:h-[420px] lg:h-[500px] rounded-lg overflow-hidden shadow-2xl min-w-0">
            <img 
              src="https://i.ibb.co.com/pr9sjvZz/b7bec0ec-0795-4a90-8a73-078ecb7aa5c3.jpg" 
              alt="Industrial Work Site" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-brand/20"></div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-slate-900 rounded-lg p-6 sm:p-10 lg:p-16 text-white text-center min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 text-brand">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Assurance</h3>
              <p className="text-slate-400">Every part and tarp undergoes rigorous testing to meet strict safety and durability standards.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 text-brand">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Rapid Deployment</h3>
              <p className="text-slate-400">We maintain high inventory levels to ensure next-day dispatch for critical components.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 text-brand">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Client Partnership</h3>
              <p className="text-slate-400">We work collaboratively with you as long-term partners, not just parts suppliers.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;