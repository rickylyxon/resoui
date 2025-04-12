import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "../../utils/axios";
import { useForm } from "react-hook-form";
import Input from "../../components/Input";
import { IoClose } from "react-icons/io5";

const EditEvent = () => {
  const [eventData, setEventData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    const fetchEvent = async () => {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        toast.error("No authorization token found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get("/admin/event", {
          headers: { Authorization: token },
        });

        const event = response.data.eventDetails.event;
        setEventData(event);

        reset({
          event: event?.event || "",
          date: event?.date || "",
          description: event?.description || "",
          fee: event?.fee || "",
        });

        toast.success(response.data.message);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load event data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [reset]);

  const handleUpdate = async (data: any) => {
    const token = localStorage.getItem("Authorization");
    if (!token || !eventData) {
      toast.error("Missing token or event data");
      return;
    }

    // Clean empty strings to undefined
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === "" ? undefined : value,
      ])
    );

    try {
      const response = await axios.put(
        "/admin/event",
        {
          ...cleanedData,
          eventId: eventData?.id,
        },
        {
          headers: { Authorization: token },
        }
      );

      toast.success(response.data.message || "Event updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-blue-400">Edit Event</h2>
              <button 
                onClick={() => window.history.back()}
                className="text-gray-400 hover:text-white transition"
              >
                <IoClose size={24} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleUpdate)} className="p-6 space-y-6">
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
              <Input
                label="Description"
                id="description"
                type="text"
                register={register("description")}
              />
              <Input
                label="Fee (₹)"
                id="fee"
                type="number"
                register={register("fee")}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-md font-medium text-white transition ${
                isSubmitting
                  ? "bg-blue-700 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;