import { scroller } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FiHome, FiCalendar, FiInfo, FiUserPlus, FiMenu, FiX } from "react-icons/fi";

const ParticipantHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (section: "home" | "event" | "about") => {
    setIsMobileMenuOpen(false);
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
    <>
      {/* Main Navigation Bar */}
      <nav className={`fixed top-0 left-0 w-full px-4 py-3 flex justify-between items-center transition-all duration-300 z-50 ${
        isScrolled 
          ? "bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-blue-500/30" 
          : "bg-gray-900"
      }`}>
        {/* Mobile Menu Button and Logo/Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-blue-400 p-2"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavClick(section.id as "home" | "event" | "about")}
                className={`flex items-center px-3 py-2 rounded-md transition-all duration-300 ${
                  location.pathname === "/" && activeSection === section.id
                    ? "text-blue-400 font-medium bg-gray-800"
                    : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
                }`}
              >
                {section.icon}
                <span className="ml-1">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Actions - Now includes Register button on mobile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <RouterLink
            to="/register"
            className={`flex items-center p-2 sm:px-3 sm:py-2 rounded-md transition-all duration-300 ${
              location.pathname === "/register"
                ? "text-white bg-blue-600 font-medium"
                : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
            }`}
          >
            <FiUserPlus className="w-5 h-5" />
            <span className="hidden sm:inline ml-2">Register</span>
          </RouterLink>
          <RouterLink
            to="/profile"
            className={`p-2 rounded-full transition-all duration-300 ${
              location.pathname === "/profile"
                ? "text-blue-400 bg-gray-800"
                : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
            }`}
            title="Profile"
          >
            <CgProfile className="w-5 h-5 sm:w-6 sm:h-6" />
          </RouterLink>
        </div>
      </nav>

      {/* Mobile Menu - Navigation links only */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-gray-800 shadow-lg z-40 md:hidden">
          <div className="flex flex-col py-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavClick(section.id as "home" | "event" | "about")}
                className={`flex items-center px-4 py-3 transition-all duration-300 ${
                  location.pathname === "/" && activeSection === section.id
                    ? "text-blue-400 bg-gray-700"
                    : "text-gray-300 hover:text-blue-400 hover:bg-gray-700"
                }`}
              >
                {section.icon}
                <span className="ml-3">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ParticipantHeader;