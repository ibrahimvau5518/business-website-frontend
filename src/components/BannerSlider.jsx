import React, { useState, useEffect } from 'react';

const bannerImages = [
  {
    url: 'https://i.ibb.co.com/6R0L1cLV/8b260b08-7fa2-40d7-b2a8-ba89d60c1311.jpg',
    title: 'Industrial Machinery Solutions',
    subtitle: 'Reliable components for all types of industrial cranes'
  },
  {
    url: 'https://i.ibb.co.com/vxZL3M4S/a6e22ac1-dbbc-4809-a658-3f128d6ffd78.jpg',
    title: 'Heavy Duty Crane Parts',
    subtitle: 'High-quality covers and protection for your equipment'
  },
  {
    url: 'https://i.ibb.co.com/rDxpLNV/a2550d57-a4dc-4c07-a659-36664f2ffccd.jpg',
    title: 'Premium Tarpaulins',
    subtitle: 'End-to-end parts and covering services'
  }
];

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {bannerImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img.url})` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase text-center mb-4 transition-transform duration-1000 transform translate-y-0">
              {img.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-center max-w-2xl text-gray-200">
              {img.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-3">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-brand scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;