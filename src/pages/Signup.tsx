import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Button from "../components/Button";
import Input from "../components/Input";
import axios from "../utils/axios";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useState } from "react";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const password = watch("password");

  const signUp = async (data: any) => {
    try {
      const response = await axios.post("/users/signup", {
        email: data.email,
        password: data.password,
        name: data.name,
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
    signUp(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-8 px-6 sm:px-8">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Sign Up
        </h1>

        {/* Form */}
        <form noValidate className="mb-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <Input
              label="Name"
              id="name"
              type="text"
              register={register("name", { required: "Name is required" })}
              error={errors.name?.message as string | undefined}
            />

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
                error={errors.password?.message as string | undefined}
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-16 right-6 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? (
                    <LuEyeClosed size={20} />
                  ) : (
                    <LuEye size={20} />
                  )}
                </button>
              )}
            </div>

            <Input
              label="Confirm Password"
              id="confirm_password"
              type="password"
              register={register("confirm_password", {
                required: "Confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              error={errors.confirm_password?.message as string | undefined}
            />
          </div>

          <Button label="Create Account" type="submit" />
        </form>

        {/* Sign In Link */}
        <div className="flex flex-wrap justify-center text-gray-300">
          <span className="mr-1">Already have an account?</span>
          <RouterLink
            to="/signin"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Sign In
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default Signup;
