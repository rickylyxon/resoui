import { Link as RouterLink } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useState } from "react";
import axios from "../utils/axios";

type FormData = {
  email: string;
  password: string;
};

const Signin = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const password = watch("password");

  const signIn = async (data: FormData) => {
    try {
      const response = await axios.post("/users/signin", {
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("Authorization", response.data.authorization);
      localStorage.setItem("UserData", JSON.stringify(response.data.userData));
      toast.success(response.data.message);
      window.location.href = "/";
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const onSubmit = (data: FormData) => {
    signIn(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-gray-800 py-8 px-6 sm:px-8 md:px-10 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-400 mb-6">
          Sign In
        </h1>

        <form noValidate className="mb-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <div className="grid gap-5">
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
                error={errors.email?.message}
              />

              <div className="relative">
                <Input
                  label="Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  register={register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "At least 6 characters" },
                    maxLength: { value: 30, message: "At most 30 characters" },
                  })}
                  error={errors.password?.message}
                />
                {password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-10 right-3 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {showPassword ? (
                      <LuEye size={20} />
                    ) : (
                      <LuEyeClosed size={20} />
                    )}
                  </button>
                )}
              </div>
            </div>

            <Button
              label="Sign In"
              type="submit"
            />
          </div>
        </form>

        <div className="flex flex-wrap justify-center text-gray-300">
          <span className="mr-1">Don't have an account?</span>
          <RouterLink
            to="/signup"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Sign up
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default Signin;
