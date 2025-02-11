import { useState } from "react";
import PropTypes from 'prop-types'
import { useNavigate } from "react-router-dom";
import {account} from "../../services/appwrite.config";

const LoginComponent = ({ setUser }) => { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await account.createEmailPasswordSession(email, password);
    } catch (error) {
      setError(error);
      console.error("Login failed:", error);
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="h-screen flex flex-col md:flex-row">
    {/* Left Side - Image (Hidden on Small Screens) */}
    <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center">
      <img 
        src="https://img.freepik.com/free-vector/blue-abstract-background_1123-51.jpg?t=st=1739207139~exp=1739210739~hmac=cf058895b4c877aca7e28e077ab78368d7e553aa836df06f93167756331fbc66&w=740" 
        alt="Login Illustration"
        className="w-full h-full object-cover"
      />
      
    </div>

    {/* Right Side - Login Form */}
    <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
      <form 
        onSubmit={handleLogin} 
        className="max-w-md w-full space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-700">Log in</h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          required 
          onChange={(e) => {
            setEmail(e.target.value)
            setError(null)
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => {
            setPassword(e.target.value)
            setError(null)
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
        />

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        {error && (
          <div className="text-red-500 text-center">
            {"Invalid credentials, please try again."}
          </div>
          
        )}

        {/* Signup Link */}
        <div className="text-center text-gray-600">
          <span>New user? </span>
          <button 
            type="button" 
            onClick={() => navigate("/signup")} 
            className="text-blue-600 underline hover:text-blue-700 transition-all"
          >
            Create an account
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

LoginComponent.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default LoginComponent;
