import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const images = [
  { src: "/events/tekken.png", title: "Tekken 8" },
  { src: "/events/tekkenRules.png", title: "Tekken Rules" },
  { src: "/events/bgmi.png", title: "BGMI" },
  { src: "/events/bgmiRules.png", title: "BGMI Rules" },
  { src: "/events/mlbb.png", title: "Mobile Legends" },
  { src: "/events/mlbbRules.png", title: "Mobiles Legends Rules" },
  { src: "/events/fifa.png", title: "FIFA 25" },
  { src: "/events/fifaRules.png", title: "FIFA 25 Rules" },
  { src: "/events/cosplay.png", title: "cosplay" },
  { src: "/events/cosplayRules.png", title: "Cosplay Rules" },
  { src: "/events/dance.png", title: "Dance" },
  { src: "/events/danceRules.png", title: "Dance Rules" },
  { src: "/events/voiceOfReso.png", title: "Voice Of Reso" },
  { src: "/events/voiceOfResoRules.png", title: "Voice Of Reso Rules" },
  { src: "/events/reels.png", title: "Reels Contest" },
  { src: "/events/reelsRules.png", title: "Reels Rules" },
  { src: "/events/quiz.png", title: "Quiz Contest" },
  { src: "/events/quizRules.png", title: "Quiz Rules" },
  { src: "/events/codedebugging.png", title: "Code Debugging" },
  { src: "/events/codejumbling.png", title: "Code Jumbling" },
  { src: "/events/electricalevent.png", title: "Electrical Events" },
];

const sponsors = [
  {
    src: "/sponsor/brplaystationHub.jpg",
    name: "BR Playstation Hub",
    url: "https://www.instagram.com/bnrgaminghub2025",
  },
  {
    src: "/sponsor/xeonPlay.jpg",
    name: "Xeon Play",
    url: "https://www.facebook.com/kyoftxeon",
  },
  {
    src: "/sponsor/pb.jpeg",
    name: "PB",
    url: "https://www.instagram.com/pb_car_and_bike_rental_service/",
  },
];

function InfiniteCarousel() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const sponsorsContainerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const [sponsorItems] = useState([...sponsors, ...sponsors]);

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

  const handleEventClick = () => {
    const token = localStorage.getItem("Authorization");
    navigate(token ? "/register" : "/signup");
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

  useEffect(() => {
    if (!sponsorsContainerRef.current) return;

    const container = sponsorsContainerRef.current;
    const items = container.children;
    if (items.length === 0) return;

    const itemWidth = items[0].clientWidth;
    const gap = 40;
    const speed = 0.6;
    let position = 0;
    const totalWidth = (itemWidth + gap) * sponsors.length;

    const animate = () => {
      position -= speed;

      if (position <= -totalWidth) {
        position = 0;
      }

      container.style.transform = `translateX(${position}px)`;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [sponsors]);

  const visibleImages = getVisibleImages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] to-[#0a1121] py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-6 sm:mb-8 tracking-wide"
          style={{
            textShadow: "0 0 10px rgba(59, 130, 246, 0.7)",
            WebkitTextStroke: "1px #3b82f6",
          }}
        >
          OUR EVENTS
        </h1>

        <div
          className="relative w-full h-[40vh] min-h-[300px] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center"
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={prevSlide}
            className="absolute left-1 xs:left-2 sm:left-4 z-10 bg-black/70 hover:bg-blue-600 rounded-full p-1.5 xs:p-2 sm:p-3 transition-all"
            aria-label="Previous slide"
          >
            <svg
              className="w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Left-side gradient overlay (darker version) */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-30 bg-gradient-to-r from-[#0A101E] via-[#0A101E]/80 to-transparent pointer-events-none"></div>

            {/* Right-side gradient overlay (using #0A101E) */}
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-30 bg-gradient-to-l from-[#0A101E] via-[#0A101E]/80 to-transparent pointer-events-none"></div>

            {visibleImages.map((image, idx) => {
              const isCenter = idx === 1;
              const position =
                idx === 0 ? "left" : idx === 1 ? "center" : "right";

              return (
                <div
                  key={`${image.src}-${position}`}
                  className={`absolute transition-all duration-500 ease-in-out cursor-pointer 
          ${
            isCenter
              ? "z-20 w-[70%] xs:w-3/4 sm:w-2/3 h-full"
              : position === "left"
              ? "z-10 left-0 w-[22%] xs:w-[20%] sm:w-[18%] h-[50%] xs:h-[55%] sm:h-[60%] opacity-90 -translate-x-[20%] xs:-translate-x-[25%] sm:-translate-x-[35%] brightness-75 hover:brightness-90"
              : "z-10 right-0 w-[22%] xs:w-[20%] sm:w-[18%] h-[50%] xs:h-[55%] sm:h-[60%] opacity-90 translate-x-[20%] xs:translate-x-[25%] sm:translate-x-[35%] brightness-75 hover:brightness-90"
          }
          ${
            isCenter
              ? "hover:scale-[1.03] xs:hover:scale-105"
              : "hover:opacity-100 hover:scale-[1.02]"
          }
        `}
                  onClick={() => {
                    if (!isCenter) {
                      position === "left" ? prevSlide() : nextSlide();
                    } else {
                      handleEventClick();
                    }
                  }}
                >
                  <div className="relative w-full h-full">
                    {/* Dark gradient overlay for left side image */}
                    {position === "left" && (
                      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black/80 to-transparent z-10" />
                    )}

                    {/* Dark gradient overlay for right side image */}
                    {position === "right" && (
                      <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-black/80 to-transparent z-10" />
                    )}

                    <div
                      className={`relative w-full h-full rounded-md xs:rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl
              ${
                isCenter
                  ? "border-2 sm:border-3 md:border-4 border-blue-400"
                  : "border border-gray-800"
              }`}
                    >
                      <img
                        src={image.src}
                        alt={image.title}
                        className={`w-full h-full object-cover ${
                          !isCenter && "filter grayscale-[10%]"
                        }`}
                        loading="lazy"
                      />
                      <div
                        className={`absolute bottom-0 left-0 right-0 p-1.5 xs:p-2 sm:p-3 md:p-4 bg-gradient-to-t from-black/80 to-transparent 
                ${isCenter ? "opacity-100" : "opacity-0"} transition-opacity`}
                      >
                        <h3 className="text-white font-bold text-xs xs:text-sm sm:text-base md:text-lg">
                          {image.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-1 xs:right-2 sm:right-4 z-10 bg-black/70 hover:bg-blue-600 rounded-full p-1.5 xs:p-2 sm:p-3 transition-all"
            aria-label="Next slide"
          >
            <svg
              className="w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

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

        <div className="mt-16 sm:mt-20 md:mt-24">
          <h2
            className="text-2xl xs:text-3xl sm:text-4xl font-bold text-center text-white mb-8 sm:mb-12 tracking-wide"
            style={{
              textShadow: "0 0 10px rgba(59, 130, 246, 0.7)",
              WebkitTextStroke: "1px #3b82f6",
            }}
          >
            OUR SPONSORS
          </h2>

          <div className="relative w-full h-32 sm:h-40 md:h-48 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-30 bg-gradient-to-r from-[#0A101E] via-[#0A101E]/80 to-transparent pointer-events-none"></div>

            {/* Right-side gradient overlay (using #0A101E) */}
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-30 bg-gradient-to-l from-[#0A101E] via-[#0A101E]/80 to-transparent pointer-events-none"></div>

            <div
              ref={sponsorsContainerRef}
              className="absolute left-0 top-0 h-full flex items-center"
              style={{ gap: "40px", paddingLeft: "20px" }}
            >
              {sponsorItems.map((sponsor, index) => (
                <div
                  key={`${sponsor.name}-${index}`}
                  className="flex-shrink-0 w-40 sm:w-48 md:w-56 h-full"
                >
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:scale-105 transition-transform duration-500"
                  >
                    <img
                      src={sponsor.src}
                      alt={sponsor.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfiniteCarousel;
