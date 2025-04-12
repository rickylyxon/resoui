import axios from "../utils/axios";
import { useEffect, useState, useRef } from "react";
import Pdf from "../utils/Pdf";
import {
  FiDownload,
  FiX,
  FiCalendar,
  FiMail,
  FiUser,
  FiCreditCard,
  FiDollarSign,
} from "react-icons/fi";

type RegisteredEvent = {
  event: {
    event: string;
    date: string;
    fee: number;
    description?: string;
  };
  user: {
    email: string;
  };
  name: string;
  contact: string;
  address: string;
  transactionId: string;
  bankingName: string;
  approved: boolean;
  team?: {
    teamName: string;
    players: {
      name: string;
      gender: string;
      teamLeader?: boolean;
    }[];
  };
  individual?: boolean;
  createdAt: string;
};

const InfoRow = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) => (
  <div className="flex items-start mb-3">
    <div className="text-blue-400 mr-3 mt-1">
      <Icon className="text-lg" />
    </div>
    <div>
      <span className="block text-sm font-medium text-gray-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  </div>
);

const EventRegistered = () => {
  const [eventsRegistered, setEventsRegistered] = useState<RegisteredEvent[]>(
    []
  );
  const [selectedItem, setSelectedItem] = useState<RegisteredEvent | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setSelectedItem(null);
      }
    };

    if (selectedItem) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedItem]);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        console.warn("No auth token found");
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get("/users/registered", {
          headers: {
            Authorization: token,
          },
        });
        setEventsRegistered(response.data.registeredDetails);
      } catch (error) {
        console.error("Error fetching registration data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="p-4 md:p-6">
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full relative border border-gray-700 flex flex-col"
            style={{ maxHeight: "90vh" }}
          >
            {/* Close button (top-right) */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute -top-3 -right-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-colors z-10"
            >
              <FiX size={20} />
            </button>

            {/* Scrollable PDF content */}
            <div className="overflow-y-auto p-4">
              <Pdf item={selectedItem} />
            </div>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold text-blue-400 mb-6">
        Registered Events
      </h2>

      {eventsRegistered && eventsRegistered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eventsRegistered.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg border border-gray-700 p-5 hover:border-blue-500 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-blue-400 truncate">
                  {item.event?.event || "Event Name N/A"}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.approved
                      ? "bg-green-900/50 text-green-400"
                      : "bg-yellow-900/50 text-yellow-400"
                  }`}
                >
                  {item.approved ? "Approved" : "Pending"}
                </span>
              </div>

              <div className="space-y-3">
                <InfoRow
                  icon={FiCalendar}
                  label="Date of Registration"
                  value={new Date(item.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                />
                <InfoRow
                  icon={FiMail}
                  label="Email"
                  value={item.user?.email || "N/A"}
                />
                <InfoRow
                  icon={FiUser}
                  label={item.individual ? "Name" : "Team Name"}
                  value={
                    item.individual
                      ? item.name || "No name"
                      : item.team?.teamName || "No team name"
                  }
                />

                <InfoRow
                  icon={FiCreditCard}
                  label="Transaction ID"
                  value={item.transactionId || "N/A"}
                />
                <InfoRow
                  icon={FiDollarSign}
                  label="Banking Name"
                  value={item.bankingName || "N/A"}
                />
              </div>

              <button
                onClick={() => setSelectedItem(item)}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                <FiDownload />
                Download Receipt
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-8 text-center">
          <div className="text-gray-400 mb-4">
            <FiCalendar size={48} className="mx-auto opacity-50" />
          </div>
          <h3 className="text-xl font-medium text-gray-300 mb-2">
            No events registered yet
          </h3>
          <p className="text-gray-500">You haven't registered for any events</p>
        </div>
      )}
    </div>
  );
};

export default EventRegistered;
