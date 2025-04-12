import LandingHeader from "../components/Header/LandingHeaders.tsx";
import Footer from "../components/Footer.tsx";
import { Outlet } from "react-router-dom";
const Landing = () => {
  return (
    <div>
      <LandingHeader />
      <main className="pt-14 bg-black">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;