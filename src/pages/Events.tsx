import { useState, useEffect } from "react";

const images = [
  { src: "/reso2025.png", title: "Tech Revolution" },
  { src: "/reo.png", title: "Innovators Meet" },
  { src: "/resoOrange.png", title: "Future of Technology" },
];

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleImageClick = () => {
    const token = localStorage.getItem('token');
    window.location.href = token ? '/register' : '/signup';
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageSize({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate border width based on image size
  const borderWidth = Math.max(2, Math.min(4, imageSize.width / 200));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] to-[#0a1121] text-white px-4 py-12 flex flex-col items-center justify-center">
      <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-white tracking-widest mb-4 md:mb-6 text-center" style={{
        WebkitTextStroke: "1px #3b82f6",
        textShadow: "0 0 10px rgba(59, 130, 246, 0.5)"
      }}>
        EVENTS
      </h1>

      <h2 className="text-2xl md:text-3xl text-blue-400 font-semibold mb-4 md:mb-6 text-center px-2">
        {images[currentIndex].title}
      </h2>

      <div className="relative w-full max-w-4xl mx-auto" style={{
        border: `${borderWidth}px solid #3b82f6`,
        borderRadius: `${borderWidth * 2}px`,
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
      }}>
        <div className="relative aspect-[16/9] w-full flex items-center justify-center bg-black">
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].title}
            className="w-full h-full object-contain transition-opacity duration-700 cursor-pointer hover:opacity-90"
            onClick={handleImageClick}
            onLoad={handleImageLoad}
          />
        </div>

        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-blue-900/80 p-2 md:p-3 rounded-full hover:bg-blue-600 transition backdrop-blur-sm"
        >
          <svg className="h-4 w-4 md:h-6 md:w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-blue-900/80 p-2 md:p-3 rounded-full hover:bg-blue-600 transition backdrop-blur-sm"
        >
          <svg className="h-4 w-4 md:h-6 md:w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex space-x-2 md:space-x-3 mt-4 md:mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-blue-400 md:w-6" : "bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageCarousel;