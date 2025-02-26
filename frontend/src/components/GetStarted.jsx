import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const { user } = useContext(AuthContext); // Get user details from context
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to PayChain</h1>
        
        {/* Buttons in a row-wise layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Buttons for all users */}
          <button className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            View Product
          </button>
          <button className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Transaction History
          </button>

          {/* Admin-only buttons */}
          {user?.role === "admin" && (
            <>
              <button className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                Add Product
              </button>
              <button className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                Sell to Customer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
