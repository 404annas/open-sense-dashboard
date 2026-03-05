import { useState } from "react";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChangePasswordMutation } from "../../_core/Slices/apiSlice";
import { toast } from "react-toastify";
import { Button, Input } from "../../components/components";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [changePassword] = useChangePasswordMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        if (oldPassword === newPassword) {
            toast.error("New password must be different from old password");
            return;
        }

        setIsLoading(true);

        try {
            const res = await changePassword({ oldPassword, newPassword }).unwrap();
            toast.success(res.message || "Password changed successfully");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.data?.message || err.message || "Failed to change password");
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
                            Change Password
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Update your password
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Current Password"
                            id="oldPassword"
                            name="oldPassword"
                            type={showOldPassword ? "text" : "password"}
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            leftIcon={<Lock />}
                            placeholder="Enter your current password"
                            showPasswordToggle={true}
                        />

                        <Input
                            label="New Password"
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                            {isLoading ? "Changing..." : "Change Password"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center justify-center"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;