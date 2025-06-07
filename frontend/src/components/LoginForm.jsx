import  { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate ,Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

 const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      if (response.data.token) {
        // console.log("Received Token:", response.data.token); // ✅ Debugging Line
        login(response.data.token);
        navigate("/");
      } else {
        setMessage("Login failed. No token received.");
      }
    } catch (error) {
      // console.error("Login Error:", error);
      setMessage("Error logging in. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg w-11/12 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded">
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-black">
          {message && <p className="text-red-500">{message}</p>}
          <p>Dont have an account?{" "}<Link to="/register" className="text-blue-600 hover:underline">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;  