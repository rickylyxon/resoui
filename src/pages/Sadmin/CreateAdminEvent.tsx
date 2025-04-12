import Button from "../../components/Button";
import Input from "../../components/Input";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import axios from "../../utils/axios";

type EventData = {
  AdminName: string;
  AdminEmail: string;
  AdminPassword: string;
  eventName: string;
  eventDate: string;
  eventDescription: string;
  eventFee: number;
};

const CreateAdminEvent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventData>();

  const eventRegister = async (data: EventData) => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      toast.error("No authorization token found");
      return;
    }
    try {
      const response = await axios.post(
        "/sadmin/event-admin",
        {
          name: data.AdminName,
          adminEmail: data.AdminEmail,
          adminPassword: data.AdminPassword,
          event: data.eventName,
          date: data.eventDate,
          description: data.eventDescription,
          fee: data.eventFee,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const onSubmit = (data: EventData) => {
    eventRegister(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Create Event Admin
        </h1>

        <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Admin Details Section */}
          <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-white text-xl font-bold mb-4 border-b border-zinc-600 pb-2">
              Admin Details
            </h2>
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Admin Name"
                  id="AdminName"
                  type="text"
                  register={register("AdminName", {
                    required: "Admin Name is required",
                  })}
                  error={errors.AdminName?.message}
                />
              </div>
              <Input
                label="Admin Email"
                id="AdminEmail"
                type="email"
                register={register("AdminEmail", {
                  required: "Admin Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                error={errors.AdminEmail?.message}
              />
              <Input
                label="Admin Password"
                id="AdminPassword"
                type="password"
                register={register("AdminPassword", {
                  required: "Admin Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.AdminPassword?.message}
              />
            </div>
          </div>

          {/* Event Details Section */}
          <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-white text-xl font-bold mb-4 border-b border-zinc-600 pb-2">
              Event Details
            </h2>
            <div className="grid gap-4">
              <Input
                label="Event Name"
                id="eventName"
                type="text"
                register={register("eventName", {
                  required: "Event Name is required",
                })}
                error={errors.eventName?.message}
              />
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <Input
                  label="Event Date"
                  id="eventDate"
                  type="text"
                  register={register("eventDate", {
                    required: "Event Date is required",
                  })}
                  error={errors.eventDate?.message}
                />
                <Input
                  label="Event Fee (₹)"
                  id="eventFee"
                  type="number"
                  register={register("eventFee", {
                    required: "Event Fee is required",
                    min: {
                      value: 0,
                      message: "Fee cannot be negative",
                    },
                  })}
                  error={errors.eventFee?.message}
                />
              </div>
              <div>
                <label
                  htmlFor="eventDescription"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Event Description
                </label>
                <textarea
                  id="eventDescription"
                  rows={4}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  {...register("eventDescription", {
                    required: "Event Description is required",
                  })}
                />
                {errors.eventDescription && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.eventDescription.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              label="Create Event"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminEvent;
