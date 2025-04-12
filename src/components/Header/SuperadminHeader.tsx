import { scroller } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FiHome, FiCalendar, FiInfo, FiPlus, FiUsers, FiList } from "react-icons/fi";
import { FaBars, FaTimes } from "react-icons/fa";

const SuperAdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const adminLinks = [
    { 
      to: "/superadmin/create-admin-event", 
      icon: <FiPlus className="mr-2" />, 
      label: "Create" 
    },
    { 
      to: "/superadmin/details-event-admin", 
      icon: <FiUsers className="mr-2" />, 
      label: "Admin" 
    },
    { 
      to: "/superadmin/registered", 
      icon: <FiList className="mr-2" />, 
      label: "Registered" 
    },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full px-4 py-2 flex justify-between items-center transition-all duration-300 z-50 ${
        isScrolled 
          ? "bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-blue-500/30" 
          : "bg-gray-900"
      }`}>
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-blue-400"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
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
              {section.label}
            </button>
          ))}
        </div>

        {/* Admin Links */}
        <div className="hidden md:flex items-center space-x-4">
          {adminLinks.map((link) => (
            <RouterLink
              key={link.to}
              to={link.to}
              className={`flex items-center px-3 py-2 rounded-md transition-all duration-300 ${
                location.pathname === link.to
                  ? "text-blue-400 font-medium bg-gray-800"
                  : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
              }`}
            >
              {link.icon}
              {link.label}
            </RouterLink>
          ))}
          <RouterLink
            to="/superadmin/profile"
            className={`p-2 rounded-full transition-all duration-300 ${
              location.pathname === "/superadmin/profile"
                ? "text-blue-400 bg-gray-800"
                : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
            }`}
            title="Profile"
          >
            <CgProfile className="w-6 h-6" />
          </RouterLink>
        </div>

        {/* Mobile Profile Link */}
        <div className="md:hidden">
          <RouterLink
            to="/superadmin/profile"
            className={`p-2 rounded-full transition-all duration-300 ${
              location.pathname === "/superadmin/profile"
                ? "text-blue-400 bg-gray-800"
                : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
            }`}
            title="Profile"
          >
            <CgProfile className="w-6 h-6" />
          </RouterLink>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-20 left-0 w-full bg-gray-800 shadow-lg z-40 md:hidden">
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
                <span className="ml-2">{section.label}</span>
              </button>
            ))}
            {adminLinks.map((link) => (
              <RouterLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 transition-all duration-300 ${
                  location.pathname === link.to
                    ? "text-blue-400 bg-gray-700"
                    : "text-gray-300 hover:text-blue-400 hover:bg-gray-700"
                }`}
              >
                {link.icon}
                <span className="ml-2">{link.label}</span>
              </RouterLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SuperAdminHeader;