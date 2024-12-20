import axios from "axios";
import { useState } from "react";
import { FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate input
    if (!data.email || !data.password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post("http://localhost:5000/api/auth/login", data);
      console.log(response.data);

      // Navigate to welcome page after successful login
      navigate("/welcome");
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setErrorMessage(error.response.data.message || "Invalid email or password.");
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
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              id="email"
              name="email"
              onChange={handleInputChange}
              value={data.email}
              type="text"
              placeholder="Enter your email"
              className="w-full focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <FaLock className="text-gray-400 mr-2" />
            <input
              id="password"
              name="password"
              onChange={handleInputChange}
              value={data.password}
              type="password"
              placeholder="Enter your password"
              className="w-full focus:outline-none"
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
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          {/* Signup Link */}
          <div className="text-center mt-4">
            Do not have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center justify-center text-green-500 hover:underline"
            >
              <FaUserPlus className="mr-1" />
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
