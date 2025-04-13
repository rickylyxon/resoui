import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      navigate("/register");
    } else {
      navigate("/signup");
    }
  };

  return (
    <section className="min-h-screen bg-[#0a1121] text-white px-6 py-16 flex flex-col items-center justify-center">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

      <div className="max-w-4xl text-center space-y-8 relative z-10">
        {/* Title with glowing effect */}
        <div className="relative mb-10">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400">
            RESO 2025
          </h1>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-blue-400/70 to-blue-600/70 rounded-full blur-[2px]"></div>
        </div>

        {/* Main content card */}
        <div className="bg-[#0f172a]/80 backdrop-blur-sm p-8 rounded-xl border border-blue-900/50 shadow-xl shadow-blue-900/10">
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-6">
            <span className="font-bold text-blue-300">RESO 2025</span> -
            Manipur's premier tech festival where innovation sparks revolution.
            This annual convergence at Manipur Institute of Technology
            transforms the campus into a nexus of brilliant minds competing in:
          </p>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
            {[
              "⚡ Cutting-edge tech competitions",
              "⚡ Immersive workshops",
              "⚡ High-octane hackathons",
              "⚡ Future-tech exhibitions",
            ].map((item, index) => (
              <li key={index} className="flex items-start text-blue-100">
                <span className="text-blue-400 mr-2 mt-1">•</span>
                <span>{item.replace("⚡", "")}</span>
              </li>
            ))}
          </ul>

          <div className="bg-[#1e293b]/50 p-5 rounded-lg border border-blue-900/30">
            <p className="text-blue-100">
              With{" "}
              <span className="text-blue-300 font-medium">
                5000+ participants
              </span>
              ,<span className="text-blue-300 font-medium"> 30+ events</span>,
              and
              <span className="text-blue-300 font-medium">
                {" "}
                industry leaders
              </span>
              , RESO 2025 will be the ultimate proving ground for tomorrow's
              tech pioneers.
            </p>
          </div>
        </div>

        {/* Animated CTA button */}
        <div className="mt-12">
          <button
            onClick={handleRegisterClick}
            className="relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden font-medium group"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-blue-600 rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
            <span className="relative flex items-center text-blue-100 group-hover:text-white transition-colors duration-300">
              <span className="mr-2">Register Now</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="absolute inset-0 border-2 border-blue-500 rounded-full opacity-70 group-hover:border-blue-400 transition-colors duration-300"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;