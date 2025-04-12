import Footer from "../components/Footer.tsx";
import { Outlet } from "react-router-dom";
import SuperAdminHeader from "../components/Header/SuperadminHeader.tsx";
const SuperAdmin = () => {
  return (
    <div>
      <SuperAdminHeader />
      <main className="pt-14 bg-black">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default SuperAdmin