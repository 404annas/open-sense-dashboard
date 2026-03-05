import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux"; // useDispatch removed as setCredentials is now handled by authApiSlice
import { Link, useNavigate } from "react-router-dom"; // Changed from "react-router" to "react-router-dom"
import { useLoginUserMutation } from "../../_core/Slices/apiSlice.js";
import { setCredentials, logout } from "../../_core/Slices/authSlice.js"; // Changed path to authSlice.js
import { toast } from "react-toastify";
// import { setCredentials } from "../../_core/Slices/authSlice" // No longer dispatching from here
import {
  Button,
  Card,
  Heading,
  Input
} from "../components";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
// import { makeRequest } from "../../Helper/ApiHelper" // Removed makeRequest

const Login = ({ onSwitchToSignup }) => {
  // onLogin prop removed as it's not used anymore
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  // const dispatch = useDispatch() // No longer needed here
  const navigate = useNavigate();
  // const { refetch } = useGetProfileQuery(); // This hook is now from authApiSlice

  const [login, { isLoading }] = useLoginUserMutation(); // This hook is now from apiSlice

  const { userInfo } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();
      console.log(res);

      // Dispatch the credentials to store the user info
      // The backend returns token and user directly in the response (not in a 'data' field)
      dispatch(setCredentials({
        token: res.token,
        user: res.user
      }));

      toast.success(res?.message || "Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.data?.message ||
        err.message ||
        "Login failed. Make sure your internet is connected"
      );
    }
  };
  const dispatch = useDispatch();
  const handleForgot = () => {
    navigate("/forgot-password"); // Navigate to the new forgot password page
  };
  // const handleVerify = async () => {
  //   if (!formData.email.trim()) {
  //     toast.error("Enter your email");
  //     return;
  //   }
  //   navigate(`signup/verify-otp/${formData.email}`);
  // };
  const handleLogout = () => {
    dispatch(logout());
    setIsModalOpen(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ConfirmModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        confirmText={"Logout"}
        title={"Are you really want to logout?"}
        variant={"danger"}
      ></ConfirmModal>
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">

            <h2 className="text-3xl font-bold text-text-dark font-inter">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your NewsAdmin account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {userInfo ? (
              <Heading subtitle={"You are already Logged in"} />
            ) : (
              <>
                {/* Email Field */}

                <Input
                  label={"Email address"}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  leftIcon={<Mail />}
                />

                {/* Password Field */}

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  label={"Password"}
                  leftIcon={<Lock />}
                  showPasswordToggle={true}

                />

                {/*Forgot Password */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleForgot}
                    type="button"
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Forgot password?
                  </button>
                  {/* <button
                    onClick={handleVerify}
                    type="button"
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Verify if not
                  </button> */}
                </div>
              </>
            )}
            {/* Submit Button */}
            {userInfo ? (
              <>
                <Link
                  to={"/dashboard"}
                  type="button"
                  className="group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Button onClick={() => setIsModalOpen(true)} className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign up for free
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
