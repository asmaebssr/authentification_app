import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { MdCheckCircle, MdError } from "react-icons/md";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate password
    if (!password || password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );
      setSuccessMessage(response.data.message || "Password reset successfully.");
      setPassword(""); // Clear the password field
      setConfirmPassword(""); // Clear the confirm password field

        navigate("/login");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Failed to reset password. Please try again.");
      } else if (error.request) {
        setErrorMessage("Unable to connect to the server. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6 text-green-500">
          <FiLock size={50} />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Reset Password</h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 flex items-center text-red-500 text-center">
            <MdError size={20} className="mr-2" />
            {errorMessage}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 flex items-center text-green-500 text-center">
            <MdCheckCircle size={20} className="mr-2" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Input */}
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-2 text-gray-600">
              New Password
            </label>
            <input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter your new password"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="mb-2 text-gray-600">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type="password"
              placeholder="Confirm your new password"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-md transition duration-300 ${
              isSubmitting
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
