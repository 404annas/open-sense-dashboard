// src/components/Signup/
//Signup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

// --- RTK Query and Helper Imports ---
import { useRegisterUserMutation } from '../../_core/Slices/apiSlice';
import { Button, Input } from '../components'; // Your custom components

const Signup = ({ onSwitchToLogin }) => {
    // --- State Management ---
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [registerUser, { isLoading }] = useRegisterUserMutation();

    // --- Handler Functions ---
    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            const res = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            }).unwrap();

            toast.success(res.message || "Registration successful! Please check your email to verify your account.");
            navigate(`/signup/verify-otp/${formData.email}`);
        } catch (err) {
            toast.error(err.data?.message || err.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header - Styled like Login page */}
                    <div className="text-center mb-8">
                        <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                            <span className="text-white text-xl font-bold">N</span>
                        </div>
                        <h2 className="text-3xl font-bold text-text-dark font-inter">Create Your Account</h2>
                        <p className="mt-2 text-sm text-gray-600">Join the Open Sense community today</p>
                    </div>

                    {/* Form - Styled like Login page */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Text input fields with labels and icons */}
                        <Input
                            label="Full Name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your full name"
                            leftIcon={<User className="h-5 w-5 text-gray-400" />}
                        />

                        <Input
                            label="Email address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email"
                            leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                        />

                        <Input
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Create a password"
                            leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                            showPasswordToggle
                        />

                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            placeholder="Confirm your password"
                            leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
                            showPasswordToggle
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            fullWidth
                            isLoading={isLoading}
                            icon={<ArrowRight className="group-hover:translate-x-1 transition-transform" />}
                            iconPosition="right"
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">Already have an account?{" "}<button type="button" onClick={onSwitchToLogin} className="font-medium text-primary hover:text-primary/80 transition-colors">Sign in</button></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;