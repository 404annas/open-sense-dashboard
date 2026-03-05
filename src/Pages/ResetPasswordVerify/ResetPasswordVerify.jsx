import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ArrowLeft, Shield, Mail } from "lucide-react";
import { useVerifyPasswordResetOTPMutation } from "../../_core/Slices/apiSlice";
import { toast } from "react-toastify";
import { Button } from "../../components/components";

const ResetPasswordVerify = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { email } = useParams();
    const [verifyPasswordResetOTP] = useVerifyPasswordResetOTPMutation();

    // Timer countdown
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        if (value && index < 5) inputRefs.current[index + 1]?.focus();

        if (newOtp.every((digit) => digit !== "")) {
            handleVerify(newOtp.join(""));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            const newOtp = pasted.split("");
            setOtp(newOtp);
            setError("");
            handleVerify(pasted);
        }
    };

    const handleVerify = async (otpCode = otp.join("")) => {
        if (otpCode.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await verifyPasswordResetOTP({ email, otp: otpCode }).unwrap();
            toast.success(res.message || "OTP verified successfully!");
            navigate(`/reset-password/${email}`);
        } catch (err) {
            toast.error(err.data?.message || err.message || "OTP verification failed. Please try again.");
            setError(err.data?.message || "Invalid OTP or server error.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto h-16 w-16 rounded-xl bg-[#3D72FA]/10 flex items-center justify-center mb-4">
                            <Shield className="h-8 w-8 text-[#3D72FA]" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
                        <p className="mt-2 text-sm text-gray-600">We've sent a 6-digit verification code to</p>
                        <div className="flex items-center justify-center mt-2">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{email}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">Enter verification code</label>
                        <div className="flex justify-center space-x-3" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D72FA] transition-all duration-200 ${
                                        error ? "border-red-500 ring-red-500" : "border-gray-300"
                                    } ${digit ? "border-[#3D72FA] bg-[#3D72FA]/5" : ""}`}
                                    disabled={isLoading}
                                />
                            ))}
                        </div>
                        {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
                    </div>

                    <div className="space-y-4">
                        <Button
                            onClick={() => handleVerify()}
                            disabled={isLoading || otp.some((d) => !d)}
                            isLoading={isLoading}
                            fullWidth
                            icon={<ArrowRight className="size-4" />}
                            iconPosition="right"
                        >
                            {isLoading ? "Verifying..." : "Verify Code"}
                        </Button>

                        <Button 
                            variant="ghost" 
                            onClick={() => navigate("/")} 
                            fullWidth 
                            icon={<ArrowLeft className="size-4" />} 
                            disabled={isLoading}
                        >
                            Back to Login
                        </Button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">Having trouble? Check your spam folder or contact support.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordVerify;