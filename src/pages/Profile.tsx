import { useState, useEffect } from "react";
import Loading from "./Loading";
import { CiLogout } from "react-icons/ci";
import axios from "../utils/axios";
import EventRegistered from "./EventRegistered";
import { FaAlignJustify } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

type UserProfile = {
  email: string;
  name: string;
  image?: string;
};

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showEventsRegister, setShowEventsRegister] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedProfile = localStorage.getItem("UserData");
        if (storedProfile) {
          const profileParsed = JSON.parse(storedProfile);
          setProfile(profileParsed);
          return;
        }

        const respond = await axios.get("/user/profile", {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        });
        setProfile(respond.data.userData);
        localStorage.setItem("UserData", JSON.stringify(respond.data.userData));
      } catch (error) {}
    };
    fetchProfile();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("UserData");
    localStorage.removeItem("Authorization");
    window.location.href = "/";
  };

  const Sidebar = () => (
    <div className="w-full md:w-64 bg-gray-800 border-r border-gray-700 p-6 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-400">
          Hello, {profile?.name || "User"}
        </h2>
        <p className="text-gray-400 text-sm">{profile?.email}</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li className="text-gray-400 uppercase text-xs font-medium tracking-wider mb-4">
            Navigation
          </li>
          <li
            className={`px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3 ${
              !showEventsRegister
                ? "bg-blue-900/50 text-blue-400 font-medium"
                : "text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => {
              setShowEventsRegister(false);
              setIsMobileMenuOpen(false);
            }}
          >
            <span>👤</span>
            Profile Information
          </li>
          <li
            className={`px-4 py-3 rounded-lg cursor-pointer transition flex items-center gap-3 ${
              showEventsRegister
                ? "bg-blue-900/50 text-blue-400 font-medium"
                : "text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => {
              setShowEventsRegister(true);
              setIsMobileMenuOpen(false);
            }}
          >
            <span>📅</span>
            Events Registered
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition"
        >
          <CiLogout className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between bg-gray-800 p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">My Profile</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-300 hover:text-blue-400 transition"
        >
          {isMobileMenuOpen ? (
            <IoClose size={28} />
          ) : (
            <FaAlignJustify size={24} />
          )}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 border-r border-gray-700">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div 
              className="absolute inset-0 bg-black/70" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative z-10 h-full w-3/4 max-w-sm bg-gray-800">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            {profile ? (
              showEventsRegister ? (
                <EventRegistered />
              ) : (
                <div className="space-y-8">
                  <div className="pb-4 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-blue-400">
                      Personal Information
                    </h1>
                    <p className="text-gray-400">
                      View and manage your profile details
                    </p>
                  </div>

                  <div className="grid gap-6">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-400 mb-1">
                        Full Name
                      </h3>
                      <p className="text-lg font-medium">
                        {profile?.name || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-400 mb-1">
                        Email Address
                      </h3>
                      <p className="text-lg font-medium">
                        {profile?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="flex justify-center items-center h-64">
                <Loading />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;