import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { account } from "../../../services/appwrite.config";

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
      const session = await account.get();
      setUser(session);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col justify-center md:flex-row">
      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col items-center justify-center p-8 md:w-3/5">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-6">
          <h2 className="mb-16 text-3xl font-semibold text-gray-700">Log in your account</h2>

          {/* Email Input */}
          <label htmlFor="email">Email or Account ID (8 digit)</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password Input */}
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <a href="/login/reset-password" className="text-sm text-blue-700">
              Forgetten password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition-all hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
          {error && <div className="text-center text-red-500">{"Invalid credentials, please try again."}</div>}

          {/* Signup Link */}
          <div className="text-center text-gray-600">
            <span>New user? </span>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="cursor-pointer text-blue-600 underline transition-all hover:text-blue-700"
            >
              Create an account
            </button>
          </div>
        </form>
      </div>
      {/* Left Side - Image (Hidden on Small Screens) */}
      <div className="hidden items-center justify-center bg-gray-100 md:flex md:w-2/5">
        <img
          src="https://res.cloudinary.com/dlsujv3gk/image/upload/v1739469716/blue-abstract-background_1123-51_dlrqkc.avif"
          alt="Login Illustration"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

LoginComponent.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default LoginComponent;
