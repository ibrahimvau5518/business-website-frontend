import React, { useState, useEffect } from 'react';
import { createContactMessage } from '../services/apiService';
import { CONTACT_INFO } from '../constants/contactInfo';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    try {
      await createContactMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell bg-app-bg">
      <div className="page-container">
        
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="section-heading mb-4">Contact Us</h1>
          <div className="w-24 h-1.5 bg-brand mx-auto rounded"></div>
          <p className="mt-4 sm:mt-6 text-slate-600 max-w-2xl mx-auto text-base sm:text-lg px-2">
            Have a question about our products or need a custom quote? Reach out to our expert team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 min-w-0">
          
          {/* Contact Forms */}
          <div className="form-card md:p-10 lg:p-12">
            <h2 className="text-xl sm:text-2xl font-bold text-heading mb-4 sm:mb-6 uppercase tracking-wide">Send a Message</h2>
            
            {status === 'success' && (
              <div className="bg-green-50 text-green-700 p-4 rounded-sm border border-green-100 mb-6">
                Thank you! Your message has been successfully sent. We will get back to you shortly.
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 text-red-700 p-4 rounded-sm border border-red-100 mb-6">
                Failed to send your message. Please try again or contact us directly by phone or email.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2" htmlFor="name">Full Name</label>
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
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2" htmlFor="email">Email</label>
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
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2" htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-slate-800"
                  placeholder="Inquiry about crane parts"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors text-slate-800"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 text-white font-bold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md ${
                  loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-brand hover:bg-[#2b9690] hover:shadow-brand/30 hover:-translate-y-0.5'
                }`}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information & Map block */}
          <div className="flex flex-col space-y-6 sm:space-y-8 min-w-0">
            <div className="bg-slate-900 text-white p-6 sm:p-8 md:p-12 rounded-lg shadow-lg min-w-0">
              <h2 className="text-2xl font-bold mb-8 uppercase tracking-wide">Contact Information</h2>
              
              <ul className="space-y-8">
                <li className="flex items-start">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mr-6 flex-shrink-0 text-brand">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Our Location</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      {CONTACT_INFO.address.line1}<br />
                      {CONTACT_INFO.address.line2}
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 rounded-full flex items-center justify-center mr-4 sm:mr-6 flex-shrink-0 text-brand">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone Number</h3>
                    {CONTACT_INFO.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:+88${phone}`}
                        className="block text-slate-400 text-sm mb-1 hover:text-brand transition-colors"
                      >
                        {phone}
                      </a>
                    ))}
                    <p className="text-slate-500 text-xs">Call us anytime during business hours</p>
                  </div>
                </li>

                <li className="flex items-start min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 rounded-full flex items-center justify-center mr-4 sm:mr-6 flex-shrink-0 text-brand">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email Address</h3>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-slate-400 text-sm mb-1 hover:text-brand transition-colors block"
                    >
                      {CONTACT_INFO.email}
                    </a>
                    <p className="text-slate-500 text-xs">Drop us a line anytime!</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Map Placeholder */}
            <div className="bg-slate-200 rounded-lg overflow-hidden h-64 shadow-inner relative flex items-center justify-center border border-slate-300">
               <span className="text-slate-500 font-bold uppercase tracking-widest">[ Map Integration Here ]</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;