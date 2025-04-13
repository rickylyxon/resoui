//import dependencies
import { useEffect, useState } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Loading from "./pages/Loading";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Main from "./pages/Main";
import Signin from "./pages/Signin";
import AdminSignin from "./pages/Admin/AdminSignin";
import Signup from "./pages/Signup";
import Error from "./pages/Error";
import Landing from "./main/Landing";
import User from "./main/User";
import AdminProfile from "./pages/Admin/AdminProfile";
import EditEvent from "./pages/Admin/EditEvent";
import RegisteredUser from "./pages/Admin/RegisteredUser";
import SadminSignin from "./pages/Sadmin/SadminSignin";
import SadminProfile from "./pages/Sadmin/SadminProfile";
import CreateAdminEvent from "./pages/Sadmin/CreateAdminEvent";
import SadminAdminEvent from "./pages/Sadmin/SadminAdminEvent";
import SuperAdmin from "./main/Superadmin";
import Admin from "./main/Admin";
import UserEventRegistered from "./pages/Sadmin/UserEventRegistered";
import axios from "./utils/axios";

interface AuthStatus {
  auth: "USER" | "ADMIN" | "SUPERADMIN";
}

function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const AuthStatus = async () => {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        setAuthStatus(null);
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("/islogIn", {
          headers: {
            Authorization: token,
          },
        });
        setAuthStatus(response.data);
      } catch (error) {
        console.error("Error fetching authentication status:", error);
        localStorage.removeItem("UserData");
        localStorage.removeItem("Authorization");
        setAuthStatus(null);
      } finally {
        setLoading(false);
      }
    };
    AuthStatus();
  }, []);
  if (loading) return <Loading />;

  const router = createBrowserRouter(
    createRoutesFromElements(
      !authStatus ? (
        <Route path="/" element={<Landing />}>
          <Route index element={<Main />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/admin-signin" element={<AdminSignin />} />
          <Route path="/sadmin-signin" element={<SadminSignin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Error />} />
        </Route>
      ) : authStatus.auth === "ADMIN" ? (
        <Route path="/" element={<Admin />}>
          <Route index element={<Main />} />
          <Route path="/admin/event" element={<EditEvent />} />
          <Route path="/admin/registered" element={<RegisteredUser />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="*" element={<Error />} />
        </Route>
      ) : authStatus.auth === "SUPERADMIN" ? (
        <Route path="/" element={<SuperAdmin />}>
          <Route index element={<Main />} />
          <Route
            path="/superadmin/create-admin-event"
            element={<CreateAdminEvent />}
          />
          <Route
            path="/superadmin/details-event-admin"
            element={<SadminAdminEvent />}
          />
          <Route
            path="/superadmin/registered"
            element={<UserEventRegistered />}
          />
          <Route path="/superadmin/profile" element={<SadminProfile />} />
          <Route path="*" element={<Error />} />
        </Route>
      ) : (
        <Route path="/" element={<User />}>
          <Route index element={<Main />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Error />} />
        </Route>
      )
    )
  );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
