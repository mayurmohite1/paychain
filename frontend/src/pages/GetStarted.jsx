import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../dashbords/AdminDashboard";
import UserDashboard from "../dashbords/UserDashboard";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 pt-24 relative overflow-hidden overflow-y-auto">
      <div className="w-full mx-auto bg-gray-800/70 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl max-h-[calc(100vh-100px)] overflow-hidden ">
        <div className="p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full max-w-xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 text-center">
                Welcome to PayChain
              </h2>
             
            </div>

            <div className="w-full overflow-y-auto">
              {user?.role === "admin" ? <AdminDashboard  /> : <UserDashboard />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;