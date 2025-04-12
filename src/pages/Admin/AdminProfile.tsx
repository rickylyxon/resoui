import { useState, useEffect } from "react";
import Loading from "../Loading";
import { CiLogout } from "react-icons/ci";
import axios from "../../utils/axios";
import { FaAlignJustify } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";
import { HiOutlineMail, HiOutlineUser } from "react-icons/hi";
import { RiCalendarEventLine  } from "react-icons/ri";

type UserProfile = {
  email: string;
  name: string;
  event: string;
};

const AdminProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedProfile = localStorage.getItem("UserData");
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
          return;
        }

        const response = await axios.get("/admin/profile", {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        });
        setProfile(response.data.userData);
        localStorage.setItem("UserData", JSON.stringify(response.data.userData));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("UserData");
    localStorage.removeItem("Authorization");
    window.location.href = "/";
  };

  const Sidebar = () => (
    <div className="w-full md:w-64 bg-gray-900 border-r border-gray-800 p-6 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-400 mb-1">
          Hello, {profile?.name || "Admin"}
        </h2>
        <p className="text-sm text-gray-400">Administrator Dashboard</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li
            className="p-3 flex items-center gap-3 rounded-lg cursor-pointer transition hover:bg-gray-800 hover:text-blue-400 text-gray-300"
            onClick={handleLogOut}
          >
            <CiLogout className="text-xl" />
            <span>Logout</span>
          </li>
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">Admin Portal v1.0</p>
      </div>
    </div>
  );

  const InfoCard = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="text-blue-400 text-xl" />
        <h3 className="font-medium text-gray-300">{label}</h3>
      </div>
      <p className="text-white text-lg font-semibold">{value || "N/A"}</p>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Top Navbar for Mobile */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <MdAdminPanelSettings className="text-blue-400 text-2xl" />
          <h1 className="text-xl font-bold text-blue-400">Admin</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-400 hover:text-blue-400 transition"
        >
          {isMobileMenuOpen ? (
            <IoClose size={28} />
          ) : (
            <FaAlignJustify size={24} />
          )}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="block md:hidden w-full absolute z-50 h-full bg-gray-900">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="h-full bg-gray-900 rounded-lg border border-gray-800 p-6">
            {profile ? (
              <div className="flex flex-col h-full">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-blue-400 mb-2">Admin Profile</h1>
                  <p className="text-gray-400">View and manage your administrator information</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard 
                    icon={HiOutlineUser} 
                    label="Name" 
                    value={profile?.name} 
                  />
                  <InfoCard 
                    icon={HiOutlineMail} 
                    label="Email Address" 
                    value={profile?.email} 
                  />
                  <InfoCard 
                    icon={RiCalendarEventLine } 
                    label="Assigned Event" 
                    value={profile?.event ? profile.event.toUpperCase() : "Not assigned"} 
                  />
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                  <h2 className="text-lg font-semibold text-blue-400 mb-4">Account Actions</h2>
                  <button
                    onClick={handleLogOut}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-gray-300 hover:text-white"
                  >
                    <CiLogout />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;