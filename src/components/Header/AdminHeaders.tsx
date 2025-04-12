import { scroller } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FiHome, FiCalendar, FiInfo } from "react-icons/fi";

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
    <nav className="fixed top-0 left-0 w-full px-6 py-3 shadow-md flex justify-between items-center border-b border-blue-500/30 z-50 bg-gray-900 backdrop-blur-sm">
      <div className="flex items-center space-x-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => handleNavClick(section.id as "home" | "event" | "about")}
            className={`flex items-center px-3 py-2 rounded-md transition-all duration-300 ${
              location.pathname === "/" && activeSection === section.id
                ? "text-blue-400 bg-blue-900/20 font-medium"
                : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
            }`}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <RouterLink
          to="/admin/event"
          className={`px-3 py-2 rounded-md transition-all duration-300 flex items-center ${
            location.pathname === "/admin/event"
              ? "text-blue-400 bg-blue-900/20 font-medium"
              : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
          }`}
        >
          <FiCalendar className="mr-2" />
          Events
        </RouterLink>
        <RouterLink
          to="/admin/registered"
          className={`px-3 py-2 rounded-md transition-all duration-300 flex items-center ${
            location.pathname === "/admin/registered"
              ? "text-blue-400 bg-blue-900/20 font-medium"
              : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
          }`}
        >
          <FiCalendar className="mr-2" />
          Registered
        </RouterLink>
        <RouterLink
          to="/admin/profile"
          className={`p-2 rounded-full transition-all duration-300 ${
            location.pathname === "/admin/profile"
              ? "text-blue-400 bg-blue-900/20"
              : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
          }`}
          title="Profile"
        >
          <CgProfile className="w-6 h-6" />
        </RouterLink>
      </div>
    </nav>
  );
};

export default AdminHeader;