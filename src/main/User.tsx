import ParticipantHeader from "../components/Header/ParticipantHeader.tsx";
import Footer from "../components/Footer.tsx";
import { Outlet } from "react-router-dom";
const User = () => {
  return (
    <div>
      <ParticipantHeader />
      <main className="pt-14 bg-black">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default User;