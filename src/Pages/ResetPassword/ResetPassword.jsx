import { useState } from "react";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../_core/Slices/apiSlice";
import { toast } from "react-toastify";
import { Button, Input } from "../../components/components";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resetPassword] = useResetPasswordMutation();
    const navigate = useNavigate();
    const { email } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const res = await resetPassword({ email, newPassword: password }).unwrap();
            toast.success(res.message || "Password reset successfully");
            navigate("/");
        } catch (err) {
            toast.error(err.data?.message || err.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                            <span className="text-white text-xl font-bold">N</span>
                        </div>
                        <h2 className="text-3xl font-bold text-text-dark font-inter">
                            Reset Password
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter your new password
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="New Password"
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            leftIcon={<Lock />}
                            placeholder="Enter your new password"
                            showPasswordToggle={true}
                        />

                        <Input
                            label="Confirm New Password"
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            leftIcon={<Lock />}
                            placeholder="Confirm your new password"
                            showPasswordToggle={true}
                        />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            fullWidth
                            isLoading={isLoading}
                            icon={<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                            iconPosition="right"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center justify-center"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;