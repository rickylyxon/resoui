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

const CommonForm: React.FC<Props> = ({ event }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [fee, setFee] = useState(null);
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
        const response = await axios.get(
          `/users/check?event=${event?.toLowerCase()}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        // Success response, user not registered
        setFee(response.data.fee)
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
      window.location.href = "/";
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
                label="Name"
                id="name"
                type="text"
                register={register("name", {
                  required: "Name is required",
                })}
                error={errors.name?.message}
              />
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
            <div className="flex items-center justify-center">
              <Button label={"Continue"} type={"submit"} />
            </div>
          </>
        ) : (
          <div className="bg-zinc-800 p-6 rounded-md shadow-lg">
            <h2 className="text-white text-xl font-bold mb-4">
              Payment Section
            </h2>
            <img src="/s.jpg" alt="Payment QR" className="w-48 mx-auto mb-4" />
            <h3 className="text-white text-md">Registration Fee: ₹{fee}</h3>
            <Input
              label="Transaction ID"
              id="transactionId"
              type="text"
              register={register("transactionId", {
                required: "Transaction ID is required",
              })}
              error={errors.transactionId?.message}
            />
            <Input
              label="Banking Name"
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

export default CommonForm