import axios from "axios";
import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleData = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNavigate = () => {
    navigate("/login");
  };

  const validateInput = () => {
    if (!data.name) return "Full Name is required.";
    if (!data.email) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(data.email)) return "Please enter a valid email address.";
    if (!data.password) return "Password is required.";
    if (data.password.length < 6)
      return "Password must be at least 6 characters long.";
    if (data.password !== data.confirmPassword)
      return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const validationError = validateInput();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );
      console.log(response.data);

      navigate("/verify-email");

    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setErrorMessage(error.response.data.message || "An error occurred during signup.");
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
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Sign Up</h2>
        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <FaUser className="text-gray-400 mr-2" />
            <input
              name="name"
              onChange={handleData}
              value={data.name}
              type="text"
              placeholder="Full Name"
              className="w-full focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              name="email"
              onChange={handleData}
              value={data.email}
              type="email"
              placeholder="Email"
              className="w-full focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <FaLock className="text-gray-400 mr-2" />
            <input
              name="password"
              onChange={handleData}
              value={data.password}
              type="password"
              placeholder="Password"
              className="w-full focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center border border-gray-300 rounded-md p-2">
            <FaLock className="text-gray-400 mr-2" />
            <input
              name="confirmPassword"
              onChange={handleData}
              value={data.confirmPassword}
              type="password"
              placeholder="Confirm Password"
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
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
          <div className="text-center mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleNavigate}
              className="text-green-500 hover:underline"
            >
              Login
            </button>
          </div>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-green-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;