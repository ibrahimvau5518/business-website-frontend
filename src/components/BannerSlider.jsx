import React, { useState, useEffect } from 'react';

const bannerImages = [
  {
    url: 'https://i.ibb.co.com/6R0L1cLV/8b260b08-7fa2-40d7-b2a8-ba89d60c1311.jpg',
    title: 'Industrial Machinery Solutions',
    subtitle: 'Reliable components for all types of industrial cranes',
  },
  {
    url: 'https://i.ibb.co.com/vxZL3M4S/a6e22ac1-dbbc-4809-a658-3f128d6ffd78.jpg',
    title: 'Heavy Duty Crane Parts',
    subtitle: 'High-quality covers and protection for your equipment',
  },
  {
    url: 'https://i.ibb.co.com/rDxpLNV/a2550d57-a4dc-4c07-a659-36664f2ffccd.jpg',
    title: 'Premium Tarpaulins',
    subtitle: 'End-to-end parts and covering services',
  },
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
    <div className="relative w-full min-h-[280px] h-[45vh] sm:h-[50vh] md:h-[560px] lg:h-[600px] max-h-[600px] overflow-hidden">
      {bannerImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img.url})` }}
          />
          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-center mb-3 sm:mb-4 max-w-4xl leading-tight">
              {img.title}
            </h2>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-medium text-center max-w-2xl text-gray-200 px-2">
              {img.subtitle}
            </p>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-20 flex justify-center gap-2 sm:gap-3">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
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