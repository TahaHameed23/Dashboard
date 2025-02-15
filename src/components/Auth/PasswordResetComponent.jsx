/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { account } from "../../services/appwrite.config";
import { useNavigate } from "react-router-dom";

export const ResetPassword = ({ loading, setLoading, errorMessage, setErrorMessage }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    setErrorMessage("");
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await account.createRecovery(email, "http://localhost:5173/login/reset-password");
      setMessage("Password reset link sent to your email");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.code === 404 && error.type === "user_not_found") {
        return setErrorMessage("User with this email does not exist");
      }
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <h2 className="text-3xl font-semibold text-gray-700">Reset Your Password</h2>
      <p className="text-gray-500">
        Enter the email associated with your account and we’ll send you password reset instructions.
      </p>

      <label htmlFor="email">Your Email</label>
      <input
        type="email"
        value={email}
        required
        onChange={(e) => {
          setEmail(e.target.value);
          setErrorMessage("");
        }}
        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {errorMessage && <p className="text-center text-red-500">{errorMessage}</p>}
      {message && <p className="text-center text-blue-700">{message}</p>}

      <button
        onClick={() => {
          if (!email) {
            setErrorMessage("Email is required");
            return;
          }
          handleSubmit();
        }}
        disabled={loading}
        className={`text-md w-full rounded-lg py-3 font-semibold transition-all ${
          loading ? "cursor-not-allowed bg-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {loading ? "Sending..." : "Send Reset Instructions"}
      </button>
      <a href="/login" className="text-md text-blue-700">
        Return to login
      </a>
    </div>
  );
};

export const UpdatePassword = ({ loading, setLoading, errorMessage, setErrorMessage }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verified, setVerified] = useState(false);

  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get("userId");
  const secret = queryParams.get("secret");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await account.updateRecovery(userId, secret, password);
      setLoading(false);
      if (res.$id) {
        setVerified(true);
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (error) {
      setLoading(false);
      if (error.code === 401 && error.type === "user_invalid_token") {
        return setErrorMessage("Invalid token");
      }
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handlePassword = async () => {
    if (password !== confirmPassword) {
      return setErrorMessage("Passwords do not match");
    } else {
      handleSubmit();
      setErrorMessage("");
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <h2 className="text-3xl font-semibold text-gray-700">Set New Password</h2>
      <p className="text-gray-500">Enter your new password below.</p>

      <label htmlFor="password">New Password</label>
      <input
        type="password"
        required
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label htmlFor="password">Confirm Password</label>
      <input
        type="password"
        required
        minLength={8}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {errorMessage && <p className="text-center text-red-500">{errorMessage}</p>}

      <button
        onClick={() => {
          if (password.length < 8) {
            setErrorMessage("Password must be at least 8 characters");
            return;
          }
          if (!password && !confirmPassword) {
            setErrorMessage("Password is required");
            return;
          }
          handlePassword();
        }}
        disabled={loading}
        className={`w-full rounded-lg py-3 text-lg font-semibold transition-all ${
          loading ? "cursor-not-allowed bg-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {loading ? "Verifying..." : "Update Password"}
      </button>

      {verified && <p className="text-center text-lg  text-green-500">Password updated! Redirecting...</p>}
    </div>
  );
};
