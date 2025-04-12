import { scroller } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiHome, FiCalendar, FiInfo, FiLogIn } from "react-icons/fi";

const LandingHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const handleNavClick = (section: "home" | "event" | "about") => {
    if (location.pathname !== "/") {
      navigate("/", { replace: true });

      setTimeout(() => {
        scroller.scrollTo(section, {
          smooth: true,
          duration: 500,
          offset: -70,
        });
      }, 50);
    } else {
      scroller.scrollTo(section, {
        smooth: true,
        duration: 500,
        offset: -70,
      });
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [location.pathname]);

  const sections = [
    { id: "home", icon: <FiHome className="mr-2" />, label: "Home" },
    { id: "event", icon: <FiCalendar className="mr-2" />, label: "Events" },
    { id: "about", icon: <FiInfo className="mr-2" />, label: "About" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full px-6 py-3 flex justify-between items-center transition-all duration-300 z-50 ${
      isScrolled 
        ? "bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-blue-500/30" 
        : "bg-blue-950"
    }`}>
      <button 
        onClick={handleLogoClick}
        className="text-white hover:opacity-80 transition-opacity"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
          RESO
        </h1>
      </button>

      <div className="hidden md:flex items-center space-x-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleNavClick(section.id as "home" | "event" | "about")}
            className={`flex items-center px-3 py-2 rounded-md transition-all duration-300 ${
              location.pathname === "/" && activeSection === section.id
                ? "text-blue-400 font-medium"
                : "text-gray-300 hover:text-blue-400"
            }`}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <RouterLink
          to="/signin"
          className="hidden md:flex items-center px-4 py-2 text-gray-300 hover:text-blue-400 transition duration-300"
        >
          <FiLogIn className="mr-2" />
          Sign In
        </RouterLink>
        <RouterLink
          to="/signup"
          className="relative inline-flex items-center px-6 py-2 font-medium tracking-wider text-white transition-all duration-300 ease-out bg-gradient-to-r from-blue-600 to-blue-400 rounded-full group hover:shadow-lg hover:shadow-blue-500/30 overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-300 opacity-0 group-hover:opacity-100 transition duration-300"></span>
          <span className="relative z-10 flex items-center">
            Register
          </span>
        </RouterLink>
      </div>
    </nav>
  );
};

export default LandingHeader;