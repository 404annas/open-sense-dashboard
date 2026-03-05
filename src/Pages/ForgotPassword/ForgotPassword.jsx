import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../_core/Slices/apiSlice";
import { toast } from "react-toastify";
import { Button, Input } from "../../components/components";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [forgotPassword] = useForgotPasswordMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await forgotPassword({ email }).unwrap();
            toast.success(res.message || "Password reset OTP sent to your email");
            navigate(`/reset-password-verify/${email}`);
        } catch (err) {
            toast.error(err.data?.message || err.message || "Failed to send password reset OTP");
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
                            Forgot Password?
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter your email to receive a password reset code
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email address"
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<Mail />}
                            placeholder="Enter your email address"
                        />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            fullWidth
                            isLoading={isLoading}
                            icon={<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                            iconPosition="right"
                        >
                            {isLoading ? "Sending..." : "Send Reset Code"}
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

export default ForgotPassword;