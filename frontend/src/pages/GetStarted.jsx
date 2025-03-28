import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const GetStarted = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        username: payload.username,
        role: payload.role,
      });
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-8 mt-16">
      <div className="w-full max-w-4xl bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg text-center space-y-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
          Welcome to PayChain
        </h2>
        {user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
      </div>
    </div>
  );
};

export default GetStarted;
