import { useState, useEffect } from "react";
import Loading from "../Loading";
import { CiLogout } from "react-icons/ci";
import { FaAlignJustify } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import axios from "../../utils/axios";
import { toast } from "react-hot-toast";

type UserProfile = {
  email: string;
  name: string;
};

const AdminProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState<boolean | null>(null);
  const [gameRegistrationOpen, setGameRegistrationOpen] = useState<boolean | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<boolean>(false);
  const [selectedGameStatus, setSelectedGameStatus] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedProfile = localStorage.getItem("UserData");
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          const res = await axios.get("/sadmin/profile", {
            headers: { Authorization: localStorage.getItem("Authorization") },
          });
          setProfile(res.data.userData);
          localStorage.setItem("UserData", JSON.stringify(res.data.userData));
        }
        
        const resStatus = await axios.get("/sadmin/registration-open", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        setRegistrationOpen(resStatus.data.registrationOpen);
        setSelectedStatus(resStatus.data.registrationOpen);

        const resGameStatus = await axios.get("/sadmin/game-registration-open", {
          headers: { Authorization: localStorage.getItem("Authorization") },
        });
        setGameRegistrationOpen(resGameStatus.data.registrationOpen);
        setSelectedGameStatus(resGameStatus.data.registrationOpen);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("UserData");
    localStorage.removeItem("Authorization");
    window.location.href = "/";
  };

  const updateRegistrationStatus = async () => {
    setIsUpdating(true);
    try {
      const res = await axios.put(
        "/sadmin/registration-open",
        { registrationOpen: selectedStatus },
        {
          headers: { Authorization: localStorage.getItem("Authorization") },
        }
      );
      setRegistrationOpen(selectedStatus);
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error updating registration status:", error);
      toast.error("Failed to update registration status");
    } finally {
      setIsUpdating(false);
    }
  };

  const updateGameRegistrationStatus = async () => {
    setIsUpdating(true);
    try {
      const res = await axios.put(
        "/sadmin/game-registration-open",
        { gameRegistrationOpen: selectedGameStatus },
        {
          headers: { Authorization: localStorage.getItem("Authorization") },
        }
      );
      setGameRegistrationOpen(selectedGameStatus);
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error updating game registration status:", error);
      toast.error("Failed to update game registration status");
    } finally {
      setIsUpdating(false);
    }
  };

  const Sidebar = () => (
    <div className="w-full md:w-64 bg-gray-900 shadow-md shadow-blue-500/30 p-6 rounded-lg h-full flex flex-col border border-gray-700">
      <div>
        <h2 className="text-xl font-semibold text-blue-400 mb-6">
          Hello, {profile?.name || "N/A"}
        </h2>
      </div>
      <nav>
        <ul className="space-y-3">
          <li
            className="p-2 flex items-center gap-2 rounded cursor-pointer transition hover:text-blue-400 hover:bg-gray-800"
            onClick={handleLogOut}
          >
            <CiLogout className="text-xl" /> Logout
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      {/* Top Navbar for Mobile */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-400">Admin</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:text-blue-400 transition"
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
        <div className="hidden md:block w-64 p-4 h-full">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="block md:hidden w-full p-4 absolute z-50 bg-gray-900 border border-gray-800">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="h-full bg-gray-900 rounded-md shadow-md shadow-blue-500/30 p-6 flex flex-col justify-start border border-gray-800">
            {profile ? (
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h1 className="text-blue-400 text-2xl font-semibold mb-6 border-b border-blue-500 pb-2">
                    Personal Information
                  </h1>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <h2 className="text-lg font-semibold text-gray-300">
                        Name
                      </h2>
                      <p className="text-gray-400">{profile?.name || "N/A"}</p>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <h2 className="text-lg font-semibold text-gray-300">
                        Email Address
                      </h2>
                      <p className="text-gray-400">{profile?.email || "N/A"}</p>
                    </div>
                  </div>

                  <h2 className="text-blue-400 text-xl font-semibold mt-10 mb-4 border-b border-blue-500 pb-2">
                    Registration Control
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium text-gray-300">
                        Current Status:
                      </p>
                      <p
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          registrationOpen
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {registrationOpen ? "Open" : "Closed"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                      <label className="text-md text-gray-300">
                        Change Status:
                      </label>
                      <select
                        value={selectedStatus ? "open" : "closed"}
                        onChange={(e) => setSelectedStatus(e.target.value === "open")}
                        className="p-2 bg-gray-800 border border-blue-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button
                        onClick={updateRegistrationStatus}
                        disabled={isUpdating}
                        className={`bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded text-white font-semibold ${
                          isUpdating ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isUpdating ? "Updating..." : "Update"}
                      </button>
                    </div>
                  </div>

                  <h2 className="text-blue-400 text-xl font-semibold mt-10 mb-4 border-b border-blue-500 pb-2">
                    Game Registration Control
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium text-gray-300">
                        Current Status:
                      </p>
                      <p
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          gameRegistrationOpen
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {gameRegistrationOpen ? "Open" : "Closed"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                      <label className="text-md text-gray-300">
                        Change Status:
                      </label>
                      <select
                        value={selectedGameStatus ? "open" : "closed"}
                        onChange={(e) => setSelectedGameStatus(e.target.value === "open")}
                        className="p-2 bg-gray-800 border border-blue-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button
                        onClick={updateGameRegistrationStatus}
                        disabled={isUpdating}
                        className={`bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded text-white font-semibold ${
                          isUpdating ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isUpdating ? "Updating..." : "Update"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;