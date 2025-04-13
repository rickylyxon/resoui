interface Props {
  event?: string;
}

const Reel: React.FC<Props> = ({ event }) => {
  ///change this to true
  const teamAllotted = false;
  /////////////////////////

  console.log(event);

  if (teamAllotted) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-4">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-blue-400">
            🚫 Registration Closed for Reels
          </h1>
          <p className="text-gray-300">Please check back later for updates!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">
          Reels Registration
        </h1>
        <p className="text-gray-300 mb-6">
          To register for the Reels contest, send your reel video along with
          your Instagram ID and Your Full Name to the number below via WhatsApp.
          Make sure your video is clear and represents your creativity. Our team
          will review and get back to you with further updates.
        </p>
        <p className="text-lg text-yellow-300 mb-2">
          🎉 Reel registration is free!
        </p>
        <p className="text-2xl font-semibold text-green-400 mt-4">
          WhatsApp: 6009346570
        </p>
      </div>
    </div>
  );
};

export default Reel;
