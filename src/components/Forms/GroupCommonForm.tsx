import Button from "../Button";
import Input from "../Input";
import Gender from "../Gender";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { AxiosError } from "axios";
import axios from "../../utils/axios";
import { useEffect, useState } from "react";

interface Props {
  event?: string;
}

interface FormData {
  name: string;
  gender: string;
  contact: string;
  address: string;
  transactionId: string;
  bankingName: string;
}
type EventDetails = {
  id: number;
  event: string;
  date: string;
  fee: string;
  description: string;
};
interface CheckResponse {
  eventDetails: EventDetails;
  eventRegistered: boolean;
}
function parseRules(ruleString: string): string[] {
  return ruleString
    .split("-")
    .map((rule) => rule.trim())
    .filter((rule) => rule.length > 0);
}
const GroupCommonForm: React.FC<Props> = ({ event }) => {
  ///change this to true
  const teamAllotted = false;
  /////////////////////////
  const [showPayment, setShowPayment] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // Check if already registered
  useEffect(() => {
    const checkRegistration = async () => {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        toast.error("No authorization token found");
        window.location.href = "/";
        return;
      }

      try {
        const response = await axios.get<CheckResponse>(
          `/users/check?event=${event?.toLowerCase()}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        // Success response, user not registered
        setEventDetails(response.data.eventDetails);
        setAlreadyRegistered(response.data.eventRegistered || false);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;

        if (axiosError.response?.status === 409) {
          const msg = axiosError.response?.data?.message;

          if (msg === "Already Registered in this Event") {
            setAlreadyRegistered(true);
          } else {
            toast.error(msg || "Something went wrong");
          }
        } else {
          toast.error(
            axiosError.response?.data?.message || "Something went wrong"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (event) {
      checkRegistration();
    }
  }, [event]);

  const eventRegister: SubmitHandler<FormData> = async (data) => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      toast.error("No authorization token found");
      window.location.href = "/";
      return;
    }
    try {
      const response = await axios.post(
        "/users/register",
        {
          event,
          ...data,
          individual: true,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      toast.success(response.data.message);
      window.location.href = "/profile";
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Something went wrong");
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (showPayment) {
      eventRegister(data);
    } else {
      setShowPayment(true);
    }
  };

  if (loading)
    return (
      <p className="text-white text-center">Checking registration status...</p>
    );

  if (alreadyRegistered) {
    return (
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg text-white text-center ">
        <h2 className="text-xl font-bold text-red-500 mb-4">
          🔒 Already Registered
        </h2>
        <p>
          You have already registered for{" "}
          <span className="text-yellow-400">{event}</span>.
        </p>
      </div>
    );
  }
  if (teamAllotted) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-4">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-blue-400">
            🚫 Registration Closed
          </h1>
          <p className="text-gray-300">Please check back later for updates!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        {!showPayment ? (
          <>
            <div id="details" className="mt-5">
              <label htmlFor="details" className="text-white text-2xl pt-5">
                Details:
              </label>
              <Input
                label="Name / Team Name"
                id="name"
                type="text"
                register={register("name", {
                  required: "Name / Team-Name is required",
                })}
                error={errors.name?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your <strong>name</strong> if individual, or{" "}
                <strong>team name</strong> if in a group.
              </p>
              <label className="text-white text-lg mt-3 block">
                Group? Add leader info:
              </label>
              <Gender
                register={register("gender", {
                  required: "Gender is required",
                })}
                error={errors.gender?.message}
              />
              <div>
                <Input
                  label="Address"
                  id="address"
                  type="text"
                  register={register("address", {
                    required: "Address is required",
                  })}
                  error={errors.address?.message}
                />
                <Input
                  label="Contact no."
                  id="contact"
                  type="number"
                  register={register("contact", {
                    required: "Contact number is required",
                  })}
                  error={errors.contact?.message}
                />
              </div>
            </div>
            {eventDetails?.description && (
              <div className="bg-blue-900/20 p-4 rounded-md text-sm text-white mb-4">
                <h3 className="text-lg font-semibold mb-2 text-blue-400">
                  Event Rules:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {parseRules(eventDetails.description).map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-center">
              <Button label={"Continue"} type={"submit"} />
            </div>
          </>
        ) : (
          <div className="bg-zinc-800 p-6 rounded-md shadow-lg">
            <h2 className="text-white text-xl font-bold mb-4">
              Payment Section
            </h2>
            <img src="/qrreso.jpeg" alt="Payment QR" className="w-48 mx-auto mb-4" />
            <h3 className="text-white text-md">
              Registration Fee: ₹{eventDetails?.fee}
            </h3>
            <Input
              label="UPI Transaction ID"
              id="transactionId"
              type="text"
              register={register("transactionId", {
                required: "Transaction ID is required",
              })}
              error={errors.transactionId?.message}
            />
            <Input
              label="Account Holder Name"
              id="bankingName"
              type="text"
              register={register("bankingName", {
                required: "Banking Name is required",
              })}
              error={errors.bankingName?.message}
            />
            <div className="flex justify-between mt-4">
              <Button
                label="Back"
                type="button"
                onClick={() => setShowPayment(false)}
              />
              <Button label="Register" type="submit" />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default GroupCommonForm;
