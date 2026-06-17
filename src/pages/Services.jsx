import React, { useEffect } from 'react';

const servicesList = [
  {
    title: 'Custom Tarpaulin Fabrication',
    icon: (
      <svg className="w-12 h-12 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    ),
    description: 'We design and manufacture highly durable, weather-resistant tarpaulins tailored exactly to your equipment’s dimensions, ensuring optimal protection.'
  },
  {
    title: 'Heavy Machinery Parts Supply',
    icon: (
      <svg className="w-12 h-12 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description: 'Sourcing and delivering premium OEM and high-quality aftermarket crane components to keep your industrial operations running smoothly.'
  },
  {
    title: 'Site Delivery & Installation',
    icon: (
      <svg className="w-12 h-12 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    description: 'Our logistics team ensures that your heavy-duty parts and tarps are safely transported and professionally installed on-site if required.'
  },
  {
    title: 'Equipment Maintenance',
    icon: (
      <svg className="w-12 h-12 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description: 'Scheduled inspections and maintenance services for crane mechanisms and mechanical hardware to reduce downtime and maximize safety.'
  }
];

const Services = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-shell bg-app-bg">
      <div className="page-container">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="section-heading mb-4">Our Services</h1>
          <div className="w-24 h-1.5 bg-brand mx-auto rounded"></div>
          <p className="mt-4 sm:mt-6 text-slate-600 max-w-2xl mx-auto text-base sm:text-lg px-2">
            We provide comprehensive industrial solutions, ranging from custom fabrications to premium parts sourcing, built for durability and performance.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 min-w-0">
          {servicesList.map((service, index) => (
            <div key={index} className="form-card hover:shadow-xl hover:border-brand/30 transition-all duration-300 group">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand/10 transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-heading mb-3 sm:mb-4">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 sm:mt-20 bg-slate-900 rounded-lg p-6 sm:p-10 lg:p-12 text-center shadow-lg min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Need a Custom Solution?</h2>
          <p className="text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg px-2">
            Our engineering team is ready to analyze your requirements and provide bespoke tarpaulin sizes or locate hard-to-find crane components.
          </p>
          <a href="/contact" className="inline-block bg-brand hover:bg-[#2b9690] text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest transition-colors duration-300 shadow-md">
            Get a Quote Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;