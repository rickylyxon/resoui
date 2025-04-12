import { useState, useEffect, useRef } from "react";

const images = [
  { src: "/dance.png", title: "Dance" },
  { src: "/danceRules.png", title: "Dance Rules" },
  { src: "/cosplay.png", title: "cosplay" },
  { src: "/cosplayRules.png", title: "Cosplay Rules" },
];

function InfiniteCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const getVisibleImages = () => {
    const totalImages = images.length;
    return [
      images[(currentIndex - 1 + totalImages) % totalImages],
      images[currentIndex],
      images[(currentIndex + 1) % totalImages],
    ];
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isHovered) {
      animationRef.current = window.setTimeout(nextSlide, 3000);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [currentIndex, isHovered]);

  const handleResize = () => {
    // Additional responsive logic can be added here if needed
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleImages = getVisibleImages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] to-[#0a1121] py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-6 sm:mb-8 tracking-wide" style={{
          textShadow: '0 0 10px rgba(59, 130, 246, 0.7)',
          WebkitTextStroke: '1px #3b82f6'
        }}>
          OUR EVENTS
        </h1>

        <div 
          className="relative w-full h-[40vh] min-h-[300px] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center"
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Navigation Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-1 xs:left-2 sm:left-4 z-10 bg-black/70 hover:bg-blue-600 rounded-full p-1.5 xs:p-2 sm:p-3 transition-all"
            aria-label="Previous slide"
          >
            <svg className="w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Carousel Items */}
          <div className="relative w-full h-full flex items-center justify-center gap-1 xs:gap-2 sm:gap-3 md:gap-4">
            {visibleImages.map((image, idx) => {
              const isCenter = idx === 1;
              const position = idx === 0 ? 'left' : idx === 1 ? 'center' : 'right';
              
              return (
                <div
                  key={`${image.src}-${position}`}
                  className={`absolute transition-all duration-500 ease-in-out cursor-pointer 
                    ${isCenter ? 
                      'z-20 w-[70%] xs:w-3/4 sm:w-2/3 h-full' : 
                      position === 'left' ? 
                        'z-10 left-0 w-[20%] xs:w-1/5 sm:w-1/4 h-[60%] xs:h-2/3 sm:h-3/4 opacity-80 -translate-x-[20%] xs:-translate-x-1/4 sm:-translate-x-1/3' : 
                        'z-10 right-0 w-[20%] xs:w-1/5 sm:w-1/4 h-[60%] xs:h-2/3 sm:h-3/4 opacity-80 translate-x-[20%] xs:translate-x-1/4 sm:translate-x-1/3'
                    }
                    ${isCenter ? 'hover:scale-[1.03] xs:hover:scale-105' : 'hover:opacity-100 hover:scale-[0.98] xs:hover:scale-95'}
                  `}
                  onClick={() => {
                    if (!isCenter) {
                      position === 'left' ? prevSlide() : nextSlide();
                    } else {
                      const token = localStorage.getItem('token');
                      window.location.href = token ? '/register' : '/signup';
                    }
                  }}
                >
                  <div className={`relative w-full h-full rounded-md xs:rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl
                    ${isCenter ? 
                      'border-2 sm:border-3 md:border-4 border-blue-400' : 
                      'border xs:border-1.5 sm:border-2 border-gray-600'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={`absolute bottom-0 left-0 right-0 p-1.5 xs:p-2 sm:p-3 md:p-4 bg-gradient-to-t from-black/80 to-transparent 
                      ${isCenter ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                    >
                      <h3 className="text-white font-bold text-xs xs:text-sm sm:text-base md:text-lg">{image.title}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-1 xs:right-2 sm:right-4 z-10 bg-black/70 hover:bg-blue-600 rounded-full p-1.5 xs:p-2 sm:p-3 transition-all"
            aria-label="Next slide"
          >
            <svg className="w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 space-x-1.5 xs:space-x-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                idx === currentIndex ? "bg-blue-500 scale-125" : "bg-gray-500"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default InfiniteCarousel;