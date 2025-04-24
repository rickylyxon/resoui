import Button from "../Button";
import Input from "../Input";
import Gender from "../Gender";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "../../utils/axios";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";

interface Props {
  event?: string;
}

interface FormData {
  name: string;
  player1: string;
  player1Id: number;
  gender1: string;
  player2: string;
  player2Id: number;
  gender2: string;
  player3: string;
  player3Id: number;
  gender3: string;
  player4: string;
  player4Id: number;
  gender4: string;
  player5?: string;
  player5Id?: number;
  gender5?: string;
  address: string;
  contact: number;
  transactionId?: string;
  bankingName?: string;
}

type Player = {
  name: string;
  gameId: string;
  gender: string;
  teamLeader: boolean;
};

type RegisterPayload = {
  event: string | undefined;
  teamName: string;
  address: string;
  transactionId: string | undefined;
  players: Player[];
  individual: boolean;
};

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
const Bgmi: React.FC<Props> = ({ event }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameRegistrationOpen, setGameRegistrationOpen] = useState<
    boolean | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

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
        setEventDetails(response.data.eventDetails);
        setAlreadyRegistered(response.data.eventRegistered);
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
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

    const fetchStatus = async () => {
      try {
        const response = await axios.get("/users/game-status");
        setGameRegistrationOpen(response.data.registrationOpen);
      } catch (err) {
        console.error("Error fetching registration status", err);
        setGameRegistrationOpen(true); // Default to open if there's an error
      } finally {
        setLoading(false);
      }
    };

    if (event) {
      checkRegistration();
      fetchStatus();
    }
  }, [event]);

  const eventRegister = async (requestData: RegisterPayload) => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      toast.error("No authorization token found");
      window.location.href = "/";
      return;
    }

    try {
      const response = await axios.post("/users/register", requestData, {
        headers: {
          Authorization: token,
        },
      });
      toast.success(response.data.message);
      window.location.href = "/profile";
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || "Something went wrong");
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (showPayment) {
      const players = [
        {
          name: data.player1,
          gameId: data.player1Id.toString(),
          gender: data.gender1,
          teamLeader: true,
        },
        {
          name: data.player2,
          gameId: data.player2Id.toString(),
          gender: data.gender2,
          teamLeader: false,
        },
        {
          name: data.player3,
          gameId: data.player3Id.toString(),
          gender: data.gender3,
          teamLeader: false,
        },
        {
          name: data.player4,
          gameId: data.player4Id.toString(),
          gender: data.gender4,
          teamLeader: false,
        },
      ];

      // Add optional substitute if provided
      if (data.player5 && data.player5Id && data.gender5) {
        players.push({
          name: data.player5,
          gameId: data.player5Id.toString(),
          gender: data.gender5,
          teamLeader: false,
        });
      }

      const requestData = {
        event,
        name: data.name,
        teamName: data.name,
        contact: data.contact.toString(),
        address: data.address,
        transactionId: data.transactionId,
        bankingName: data.bankingName,
        players,
        individual: false,
      };

      eventRegister(requestData);
    } else {
      setShowPayment(true);
    }
  };

  if (loading) {
    return (
      <p className="text-white text-center">Checking registration status...</p>
    );
  }

  if (alreadyRegistered) {
    return (
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg text-white text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-red-500 mb-4">
          🔒 Already Registered
        </h2>
        <p>
          You have already registered for{" "}
          <span className="text-yellow-400">{event?.toUpperCase()}</span>.
        </p>
      </div>
    );
  }

  if (!gameRegistrationOpen) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-4">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-blue-400">
            🚫 Registration Closed for BGMI
          </h1>
          <p className="text-gray-300">Please check back later for updates!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        {!showPayment ? (
          <>
            <label className="text-white text-xl md:text-2xl pt-4 md:pt-7">
              Team Details :
            </label>
            <Input
              label="Team Name"
              id="name"
              type="text"
              register={register("name", {
                required: "Team Name is required",
              })}
              error={errors.name?.message}
            />

            {/* Player Information Grid */}
            <div className="grid grid-cols-1 gap-6 mb-2">
              {/* Team Leader Card */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-blue-400 font-medium mb-3">Team Leader</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Name"
                    id="player1"
                    type="text"
                    register={register("player1", {
                      required: "Team Leader Name is required",
                    })}
                    error={errors.player1?.message}
                  />
                  <Input
                    label="ID"
                    id="player1Id"
                    type="number"
                    register={register("player1Id", {
                      required: "Team Leader ID is required",
                      valueAsNumber: true,
                    })}
                    error={errors.player1Id?.message}
                  />
                  <Gender
                    register={register("gender1", {
                      required: "Gender is required",
                    })}
                    error={errors.gender1?.message}
                  />
                </div>
              </div>

              {/* Player 2 Card */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-blue-400 font-medium mb-3">Player 2</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Name"
                    id="player2"
                    type="text"
                    register={register("player2", {
                      required: "Player 2 Name is required",
                    })}
                    error={errors.player2?.message}
                  />
                  <Input
                    label="ID"
                    id="player2Id"
                    type="number"
                    register={register("player2Id", {
                      required: "Player 2 ID is required",
                      valueAsNumber: true,
                    })}
                    error={errors.player2Id?.message}
                  />
                  <Gender
                    register={register("gender2", {
                      required: "Gender is required",
                    })}
                    error={errors.gender2?.message}
                  />
                </div>
              </div>

              {/* Player 3 Card */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-blue-400 font-medium mb-3">Player 3</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Name"
                    id="player3"
                    type="text"
                    register={register("player3", {
                      required: "Player 3 Name is required",
                    })}
                    error={errors.player3?.message}
                  />
                  <Input
                    label="ID"
                    id="player3Id"
                    type="number"
                    register={register("player3Id", {
                      required: "Player 3 ID is required",
                      valueAsNumber: true,
                    })}
                    error={errors.player3Id?.message}
                  />
                  <Gender
                    register={register("gender3", {
                      required: "Gender is required",
                    })}
                    error={errors.gender3?.message}
                  />
                </div>
              </div>

              {/* Player 4 Card */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-blue-400 font-medium mb-3">Player 4</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Name"
                    id="player4"
                    type="text"
                    register={register("player4", {
                      required: "Player 4 Name is required",
                    })}
                    error={errors.player4?.message}
                  />
                  <Input
                    label="ID"
                    id="player4Id"
                    type="number"
                    register={register("player4Id", {
                      required: "Player 4 ID is required",
                      valueAsNumber: true,
                    })}
                    error={errors.player4Id?.message}
                  />
                  <Gender
                    register={register("gender4", {
                      required: "Gender is required",
                    })}
                    error={errors.gender4?.message}
                  />
                </div>
              </div>

              {/* Substitute (Optional) Card */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-blue-400 font-medium mb-3">
                  Substitute (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Name"
                    id="player5"
                    type="text"
                    register={register("player5")}
                  />
                  <Input
                    label="ID"
                    id="player5Id"
                    type="number"
                    register={register("player5Id", { valueAsNumber: true })}
                  />
                  <Gender
                    register={register("gender5")}
                    error={errors.gender5?.message}
                  />
                </div>
              </div>
            </div>

            {/* Team Leader Details */}
            <div id="teamleader" className="mt-5">
              <label
                htmlFor="teamleader"
                className="text-white text-xl md:text-2xl pt-3 md:pt-5"
              >
                Team Leader details:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    valueAsNumber: true,
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

            <div className="flex items-center justify-center mt-6">
              <Button label={"Continue"} type={"submit"} />
            </div>
          </>
        ) : (
          <div className="bg-zinc-800 p-6 rounded-md shadow-lg max-w-md mx-auto">
            <h2 className="text-white text-xl font-bold mb-4">
              Payment Section
            </h2>
            <img src="/payment.jpeg" alt="Payment QR" className="w-48 mx-auto mb-4" />
            <h3 className="text-white text-sm md:text-md">
              Registration Fee: ₹{eventDetails?.fee}
            </h3>
            <div className="space-y-4 mt-4">
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
            </div>
            <div className="flex justify-between mt-6 gap-4">
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

export default Bgmi;
