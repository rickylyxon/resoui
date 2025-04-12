import { Link as RouterLink } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const Error = () => {
  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md text-center bg-gray-800 p-8 rounded-xl border border-red-500/30 shadow-lg shadow-red-500/10">
        <div className="flex justify-center mb-4">
          <FaExclamationTriangle className="text-red-500 text-5xl animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold text-red-400 mb-2">404 Error</h1>
        <p className="text-gray-300 mb-6">
          <strong>Oops!</strong> We can't find the page you're looking for.
        </p>
        
        <RouterLink
          to="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
        >
          Return to Home
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </RouterLink>
      </div>
    </div>
  );
};

export default Error;