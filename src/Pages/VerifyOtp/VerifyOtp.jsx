"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"
import { ArrowRight, ArrowLeft, RefreshCw, Shield, Mail } from "lucide-react"
import { toast } from "react-toastify"
import { useVerifyOTPMutation } from "../../_core/Slices/apiSlice.js"; // Changed path
import { setCredentials } from "../../_core/Slices/authSlice.js";
// import { makeRequest } from "../../Helper/ApiHelper" // Removed makeRequest

import { Button } from "../../components/components"
import { makeRequest } from "../../Helper/ApiHelper.js"

const VerifyOtp = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    // const [isLoading, setIsLoading] = useState(false) // To be replaced by isVerifyingOtp
    // const [isResending, setIsResending] = useState(false) // To be replaced by isResendingOtp
    const [error, setError] = useState("")
    const [timeLeft, setTimeLeft] = useState(60) // Changed initial time to 60s
    const [canResend, setCanResend] = useState(false)

    const inputRefs = useRef([])
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { email } = useParams()
    // const [sendOtp, { isLoading: isResendingOtp, refetch }] = useSendOtpMutation(); // Use specific loading state
    const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOTPMutation(); // Use specific loading state
    // useEffect(() => {
    //     makeRequest({
    //         apiFunc: sendOtp,
    //         data: { email },
    //         toast
    //     })
    // }, [email])

    // Auto-send OTP on mount - Removed as it's typically part of SendOtp page logic or handled by navigation flow

    // Timer countdown
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [timeLeft])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        setError("")

        if (value && index < 5) inputRefs.current[index + 1]?.focus()

        if (newOtp.every((digit) => digit !== "")) handleVerify(newOtp.join(""))
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        if (pasted.length === 6) {
            const newOtp = pasted.split("")
            setOtp(newOtp)
            setError("")
            handleVerify(pasted)
        }
    }

    const handleVerify = async (otpCode = otp.join("")) => {
        if (otpCode.length !== 6) {
            setError("Please enter all 6 digits")
            return
        }

        // setIsLoading(true) // Replaced by isVerifyingOtp
        setError(""); // Clear local error

        try {
            const res = await verifyOtp({ email, otp: otpCode }).unwrap();
            toast.success(res?.message || "OTP verified successfully!");

            // Store user info in Redux store
            if (res.user && res.token) {
                // Dispatch action to store user info
                dispatch(setCredentials({
                    token: res.token,
                    user: res.user
                }));

                // Navigate to dashboard after successful verification
                navigate("/dashboard");
            } else {
                // If the response doesn't contain token, navigate to login
                navigate(`/`);
            }
        } catch (err) {
            toast.error(err.data?.message || err.message || "OTP verification failed. Please try again.");
            setError(err.data?.message || "Invalid OTP or server error."); // Set local error for display
        }
        // setIsLoading(false) // Replaced by isVerifyingOtp
    }

    // const handleResendOtp = async () => {
    //     // try {
    //     //     await sendOtp({ email }).unwrap();
    //     //     toast.success("OTP resent successfully");
    //     //     setTimeLeft(60); // Reset timer to a more standard 60 seconds
    //     //     setCanResend(false);
    //     //     setOtp(["", "", "", "", "", ""]);
    //     //     if (inputRefs.current[0]) inputRefs.current[0].focus();
    //     // } catch (err) {
    //     //     toast.error(err.data?.message || err.message || "Failed to resend OTP.");
    //     // }
    //     makeRequest({
    //         apiFunc: sendOtp,
    //         data: { email },
    //         toast
    //     })

    // }

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
                                    className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D72FA] transition-all duration-200 ${error ? "border-red-500 ring-red-500" : "border-gray-300"
                                        } ${digit ? "border-[#3D72FA] bg-[#3D72FA]/5" : ""}`}
                                    disabled={isVerifyingOtp} // Use isVerifyingOtp
                                />
                            ))}
                        </div>
                        {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
                    </div>

                    {/* <div className="text-center mb-6">
                        {!canResend ? (
                            <p className="text-sm text-gray-600">
                                Resend Otp in <span className="font-medium text-[#3D72FA]">{formatTime(timeLeft)}</span>
                            </p>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">Didn't receive the code?</p>
                                <Button
                                    variant="link"
                                    onClick={handleResendOtp}
                                    disabled={isResendingOtp || !canResend} // Use isResendingOtp
                                    icon={
                                        isResendingOtp ? ( // Use isResendingOtp
                                            <RefreshCw className="size-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="size-4" />
                                        )
                                    }
                                    className="text-[#3D72FA]"
                                >
                                    {isResendingOtp ? "Sending..." : "Resend Code"}
                                </Button>
                            </div>
                        )}
                    </div> */}

                    <div className="space-y-4">
                        <Button
                            onClick={() => handleVerify()}
                            disabled={isVerifyingOtp || otp.some((d) => !d)} // Use isVerifyingOtp
                            isLoading={isVerifyingOtp} // Use isVerifyingOtp
                            fullWidth
                            icon={<ArrowRight className="size-4" />}
                            iconPosition="right"
                        >
                            {isVerifyingOtp ? "Verifying..." : "Verify Code"}
                        </Button>

                        <Button variant="ghost" onClick={() => navigate("/")} fullWidth icon={<ArrowLeft className="size-4" />} disabled={isVerifyingOtp}>
                            Back to Login
                        </Button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">Having trouble? Check your spam folder or contact support.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyOtp
