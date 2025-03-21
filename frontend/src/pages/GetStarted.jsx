import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check authentication and get user role
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Parse the JWT token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        username: payload.username,
        role: payload.role,
      });
    } catch (error) {
      // Invalid token
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to PayChain</h1>
        {user && <p className="mb-4">Logged in as: {user.username}</p>}

        {/* Buttons in a row-wise layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Buttons for all users */}
          <button
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => navigate("/view-products")}
          >
            View Product
          </button>
          <button
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => navigate("/transaction-history")}
          >
            Transaction History
          </button>

          {/* Admin-only buttons */}
          {user?.role === "admin" && (
            <>
              <button
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                onClick={() => navigate("/add-product")}
              >
                Add Product
              </button>
              <button
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                onClick={() => navigate("/sell")}
              >
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
