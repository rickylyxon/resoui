import React from 'react';

interface HomeProps {
  scrollToEvents: () => void;
}

const Home: React.FC<HomeProps> = ({ scrollToEvents }) => {
  const handleRegisterClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/register';
    } else {
      window.location.href = '/signup';
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-[#0a0e1a] via-[#0f172a] to-[#0a1121] min-h-screen overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:100px_100px]"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-500/10"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(40px)',
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out alternate`
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-screen px-4 sm:px-6 lg:px-8">
        <div className="mb-8 w-full max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 mb-6 text-sm font-medium text-blue-300 bg-blue-900/30 rounded-full border border-blue-800/50">
            April 28-30, 2025 • MIT Manipur
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
              RESO
            </span>
            <span className="text-white"> 2025</span>
          </h1>
          
          <div className="relative w-48 sm:w-64 h-1 mx-auto mt-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400 to-blue-500/0 rounded-full"></div>
          </div>
        </div>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-blue-100/80 max-w-2xl leading-relaxed px-4">
          Manipur's premier tech-cultural extravaganza where innovation meets creativity. 
          Join 5000+ participants for 72 hours of adrenaline-pumping technical challenges, 
          mind-bending problem-solving, and artistic showcases that push boundaries.
        </p>

        <p className="mt-4 text-sm sm:text-base text-blue-200/70 max-w-2xl leading-relaxed px-4">
          Experience the perfect fusion of engineering brilliance and artistic expression 
          through competitive battles, design sprints, and vibrant performances that 
          redefine what's possible at the intersection of technology and culture.
        </p>

        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none justify-center">
          <button
            onClick={scrollToEvents}
            className="px-6 py-3 sm:px-8 sm:py-3.5 font-medium rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105 text-sm sm:text-base"
          >
            Explore Events
          </button>
          <button
            onClick={handleRegisterClick}
            className="px-6 py-3 sm:px-8 sm:py-3.5 font-medium rounded-full bg-transparent text-blue-300 border-2 border-blue-500/50 hover:border-blue-400 hover:text-white transition-all hover:scale-105 text-sm sm:text-base"
          >
            Register Now
          </button>
        </div>
      </div>

      <style >{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;