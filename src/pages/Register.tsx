import { useEffect, useState } from "react";
import Select from "react-select";
import Bgmi from "../components/Forms/Bgmi";
import MobileLegend from "../components/Forms/MobileLegend";
import { Quantum } from "ldrs/react";
import CommonForm from "../components/Forms/CommonForm";
import axios from "../utils/axios";
import { Toaster } from "react-hot-toast";
import GroupCommonForm from "../components/Forms/GroupCommonForm";
import GroupsForm from "../components/Forms/GroupsForm";
import Reel from "../components/Forms/Reel";

type OptionType = {
  value: string;
  label: string;
};

const customStyles = {
  menuPortal: (provided: any) => ({ ...provided, zIndex: 9999 }),
  menu: (provided: any) => ({ ...provided, zIndex: 9999 }),
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "#111827",
    borderColor: state.isFocused ? "#3b82f6" : "#374151",
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    color: "white",
    minHeight: "48px",
    "&:hover": { borderColor: "#3b82f6" },
  }),
  option: (base: any, { isFocused, isSelected }: any) => ({
    ...base,
    backgroundColor: isSelected ? "#1d4ed8" : isFocused ? "#1e3a8a" : "#111827",
    color: "white",
    padding: "12px 16px",
    "&:active": {
      backgroundColor: "#1e40af",
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "white",
    fontSize: "0.875rem",
  }),
  input: (base: any) => ({
    ...base,
    color: "white",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "0.875rem",
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: "#9ca3af",
    "&:hover": {
      color: "#3b82f6",
    },
  }),
  indicatorSeparator: (base: any) => ({
    ...base,
    backgroundColor: "#374151",
  }),
};

const options: OptionType[] = [
  { value: "tekken8", label: "Tekken 8 (Gaming)" },
  { value: "bgmi", label: "BGMI (Gaming)" },
  { value: "mobilelegend", label: "Mobile Legend (Gaming)" },
  // { value: "classicalfolkdancegroup", label: "Classical & Folk Group (Dance Contest)" },
  { value: "cosplay", label: "Cosplay Contest" },
  { value: "reel", label: "Reel Contest" },
  { value: "spotpanting", label: "Painting (Spot Event)" },
  { value: "spotphotography", label: "Photography (Spot Event)" },
  { value: "treasurehunt", label: "Treasure Hunt (Spot Event)" },
  { value: "debate", label: "Debate (Literary Event)" },
  { value: "codedebugging", label: "Code Debugging - CSE - (Technical Event)" },
  { value: "codejumbling", label: "Code Jumbling - CSE - (Technical Event)" },
  {
    value: "structuralmodelling",
    label: "Structural Modelling - CE - (Technical Event)",
  },
  { value: "autocaddesign", label: "Autocad Design - CE - (Technical Event)" },
  {
    value: "paperplane",
    label: "Paper Plane Design - ME - (Technical Event)",
  },
  {
    value: "origami",
    label: "Origami Engineering - ME - (Technical Event)",
  },
  { value: "mindmapmania", label: "Mind Map Mania - EE - (Technical Event)" },
  { value: "innovista", label: "Innovista - EE - (Technical Event)" },
  { value: "circuitscript", label: "Circuit Script - EE - (Technical Event)" },
  { value: "circuitdesign", label: "Circuit Design - ECE - (Technical Event)" },
  { value: "componentanalysis", label: "Component Analysis - ECE - (Technical Event)" },
];

const Register = () => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState<boolean | null>(null);
  
  const specialComponents: Record<string, React.ElementType> = {
    bgmi: Bgmi,
    mobilelegend: MobileLegend,
    westernsong : GroupCommonForm,
    moderndancegroup : GroupsForm,
    classicalfolkdancegroup : GroupsForm,
    debate:GroupsForm,
    quiz:GroupsForm,
    treasurehunt:GroupsForm,
    reel: Reel,
  };

  const SelectedComponent =
    selectedOption?.value && specialComponents[selectedOption.value]
      ? specialComponents[selectedOption.value]
      : CommonForm;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get("/users/status");
        setRegistrationOpen(response.data.registrationOpen);
      } catch (err) {
        console.error("Error fetching registration status", err);
        setRegistrationOpen(true); 
      }
    };

    fetchStatus();
  }, []);

  if (registrationOpen === null) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <Quantum size="150" speed="4" color="#3b82f6" />
      </div>
    );
  }

  if (!registrationOpen) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-4">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-blue-400">🚫 Registration Closed</h1>
          <p className="text-gray-300">Please check back later for updates!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#1f2937',
          color: 'white',
          border: '1px solid #374151'
        }
      }} />
      
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">Event Registration</h1>
          <p className="text-gray-400">Select an event to participate</p>
        </div>

        <div className="mb-8">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Event to participate
          </label>
          <Select
            value={selectedOption}
            onChange={setSelectedOption}
            options={options}
            isSearchable
            placeholder="Select an event..."
            className="text-white"
            styles={customStyles}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            classNamePrefix="select"
          />
        </div>

        {selectedOption ? (
          <SelectedComponent event={selectedOption.value} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Quantum size="100" speed="4" color="#3b82f6" />
            <p className="mt-4 text-gray-400">Please select an event to continue</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;