import  { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

  const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
      setMessage('Registration successful! You can now login.');
      // console.log(response.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage('User already exists. Please login.');
      } else {
        setMessage('Error registering. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg w-11/12 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">Register</h1>
        
        <form onSubmit={handleRegister}>
          <input 
            type="text" 
            id="username" // Added id
            name="username" // Added name
            placeholder="Enter Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className="w-full p-3 mb-4 border border-gray-300 rounded"
            autoComplete="username"
          />
          <input 
            type="email" 
            id="email" // Added id
            name="email" // Added name
            placeholder="Enter Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full p-3 mb-4 border border-gray-300 rounded"
            autoComplete="email"
          />
          <input 
            type="password" 
            id="password" // Added id
            name="password" // Added name
            placeholder="Enter Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full p-3 mb-4 border border-gray-300 rounded"
            autoComplete="current-password"

          />
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center text-black">
          {message && <p className={`text-${message.includes('successful') ? 'green' : 'red'}-500`}>{message}</p>}
          <p>Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
