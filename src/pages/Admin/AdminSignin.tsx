import Button from "../../components/Button";
import Input from "../../components/Input";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import axios from "../../utils/axios";
import { FaUserCog } from "react-icons/fa";

const AdminSignin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signIn = async (data: any) => {
    try {
      const response = await axios.post("/admin/signin", {
        adminEmail: data.email,
        adminPassword: data.password,
      });
      localStorage.setItem("Authorization", response.data.authorization);
      localStorage.setItem("UserData", JSON.stringify(response.data.userData));
      toast.success(response.data.message);
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const onSubmit = (data: any) => {
    signIn(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600/20 p-4 rounded-full mb-4">
            <FaUserCog className="text-blue-400 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Admin Login</h1>
          <p className="text-gray-400">Enter your admin credentials</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Input
                label="Email"
                id="email"
                type="email"
                register={register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S{2,}$/,
                    message: "Invalid email",
                  },
                })}
                error={errors.email?.message as string | undefined}
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                id="password"
                type="password"
                register={register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                  maxLength: { value: 30, message: "At most 30 characters" },
                })}
                error={errors.password?.message as string | undefined}
              />
            </div>
          </div>

          <Button label="Sign In" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default AdminSignin;
