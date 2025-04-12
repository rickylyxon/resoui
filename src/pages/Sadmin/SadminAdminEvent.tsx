import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import axios from "../../utils/axios";
import { useForm } from "react-hook-form";
import Input from "../../components/Input";
import Button from "../../components/Button";

const SadminAdminEvent = () => {
  const [adminEventData, setAdminEventData] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset } = useForm();

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
        setSelectedEvent(null);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const fetchAdminEventData = async () => {
      const token = localStorage.getItem("Authorization");
      if (!token) return toast.error("No authorization token found");

      try {
        const response = await axios.get("/sadmin/event-admin", {
          headers: { Authorization: token },
        });
        setAdminEventData(response.data.adminEvent);
        toast.success(response.data.message);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };
    fetchAdminEventData();
  }, []);

  const openEditModal = (item: any) => {
    setSelectedEvent(item);
    setIsModalOpen(true);
    reset({
      event: item.event?.event || "",
      date: item.event?.date || "",
      description: item.event?.description || "",
      fee: item.event?.fee || "",
    });
  };

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("Authorization");
    if (!token || !selectedEvent) return toast.error("Missing token or event");

    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === "" ? undefined : value,
      ])
    );

    try {
      await axios.put(
        "/sadmin/event",
        {
          ...cleanedData,
          eventId: selectedEvent.event?.id,
        },
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Event updated successfully");
      setIsModalOpen(false);
      setSelectedEvent(null);
      setAdminEventData((prev) =>
        prev.map((item) =>
          item.event?.id === selectedEvent.event?.id
            ? { ...item, event: { ...item.event, ...cleanedData } }
            : item
        )
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-8">
      <div className="max-w-full overflow-hidden rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gradient-to-r from-red-600 to-red-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Event ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Admin Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Admin Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {adminEventData?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.event?.id || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {item.event?.event || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.event?.date || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                    {item.event?.description || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ₹{item.event?.fee || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <Button
                      onClick={() => openEditModal(item)}
                      label="Edit"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Edit Event</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedEvent(null);
                }}
                type="button"
                className="text-gray-400 hover:text-white"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit(handleUpdate)} className="p-6">
              <div className="space-y-4">
                <Input
                  label="Event Name"
                  id="event"
                  type="text"
                  register={register("event")}
                />
                <Input
                  label="Date"
                  id="date"
                  type="text"
                  register={register("date")}
                />
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    {...register("description")}
                  />
                </div>
                <Input
                  label="Fee (₹)"
                  id="fee"
                  type="number"
                  register={register("fee")}
                />
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  label="Update Event"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SadminAdminEvent;