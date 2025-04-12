import { UseFormRegisterReturn } from "react-hook-form";

type InputProps = {
  label: string;
  type: "text" | "email" | "password" | "number";
  id: string;
  register: UseFormRegisterReturn;
  error?: string;
  required?: boolean;
  autoComplete?: "on" | "off";
};

export default function Input({
  label,
  type,
  id,
  register,
  required = false,
  autoComplete = "off",
  error,
}: InputProps) {
  return (
    <div className="relative w-full pt-6">
      {/* Floating Label */}
      <label htmlFor={id} className="text-white font-medium">
        {label}
      </label>

      {/* Input Field */}
      <input
        id={id}
        type={type}
        {...register} // Register manages value and onChange automatically
        autoComplete={autoComplete}
        required={required}
        className={`w-full border-0 border-b-2 bg-transparent px-2 py-3 text-white text-sm focus:outline-none ${
          error ? "border-red-500" : "border-gray-500"
        }`}
      />

      {/* Error Message */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
