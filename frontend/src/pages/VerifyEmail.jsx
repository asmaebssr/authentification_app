import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate code
    if (!code) {
      setErrorMessage("Please enter the verification code.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post("http://localhost:5000/api/auth/verify-email", { code });
      setSuccessMessage("Email verified successfully!");
      
      // Navigate to the login page after successful verification
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Wait for 2 seconds before navigating
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setErrorMessage(error.response.data.message || "Failed to verify email. Please try again.");
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage("Unable to connect to the server. Please try again later.");
      } else {
        // Something else happened while setting up the request
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Verify Email</h2>

        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="mb-4 text-green-500 text-center">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Verification Code Input */}
          <div className="flex flex-col">
            <label htmlFor="code" className="mb-2 text-gray-600">Verification Code</label>
            <input
              id="code"
              onChange={(e) => setCode(e.target.value)}
              value={code}
              type="text"
              placeholder="Enter the code"
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
            {isSubmitting ? "Verifying..." : "Confirm"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
