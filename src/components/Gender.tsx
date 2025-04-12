import { UseFormRegisterReturn } from "react-hook-form";

type GenderProps = {
  label?: string;
  register: UseFormRegisterReturn;
  error?: string;
  required?: boolean;
};

export default function Gender({ label = "Gender", register, required = false, error }: GenderProps) {
  return (
    <div className="w-full mt-4">
      <label htmlFor="gender" className="block text-white mb-2 font-medium">
        {label}
      </label>
      <select
        id="gender"
        {...register}
        required={required}
        className={`w-full p-2 bg-gray-800 border rounded text-white outline-none ${
          error ? "border-red-500" : "border-gray-600"
        }`}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
