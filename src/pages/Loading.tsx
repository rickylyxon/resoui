import { Helix } from "ldrs/react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <Helix size={140} speed={1.75} color="green" /> 
    </div>
  );
};

export default Loading;