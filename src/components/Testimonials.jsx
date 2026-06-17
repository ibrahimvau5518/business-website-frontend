import React from 'react';

const reviews = [
  {
    name: 'Robert Harris',
    role: 'Logistics Director, BuildCorp',
    content: 'We exclusively source our heavy-duty crane hooks and wire slings from them. Their 50T hooks have been flawless under immense pressure on our skyscraper projects.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
  },
  {
    name: 'Sarah Jenkins',
    role: 'Site Manager, Vanguard Construction',
    content: 'Their custom PVC tarpaulins are incredible. 100% waterproof and they hold up against severe winds. Saved thousands of dollars worth of exposed machinery.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
  },
  {
    name: 'Michael Chen',
    role: 'Operations Head, Apex Ports',
    content: 'The 24/7 technical support is a lifesaver. We had a remote control system issue at 3 AM, and their team walked our engineers through the fix immediately.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
  }
];

const Testimonials = () => {
  return (
    <section className="w-full bg-section-light py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200 min-w-0 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full min-w-0">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-heading tracking-tight mb-4">Trusted by Industries</h2>
          <div className="w-24 h-1.5 bg-brand mx-auto rounded"></div>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">See what professionals across construction, ports, and logistics are saying about our products.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 min-w-0">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300 min-w-0 flex flex-col">
              <div className="flex space-x-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.898 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 italic mb-8 flex-grow">"{review.content}"</p>
              <div className="flex items-center">
                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h4 className="font-bold text-heading text-sm">{review.name}</h4>
                  <p className="text-xs text-slate-500">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;