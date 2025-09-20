'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaShieldAlt, FaServer } from 'react-icons/fa';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { useLoginFlow } from '@/hooks/useLoginFlow';
import LoginLoading from '@/components/auth/LoginLoading';
import { FormInput } from '@/components/ui/FormInput';
import { FormAlert } from '@/components/ui/ErrorComponents';
import { validateEmail, validateRequired } from '@/utils/validation';

interface LoginForm {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

    const { isLoading, showLoading, error, login, completeLogin } = useLoginFlow();

    // Validate individual fields
    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'email':
                const emailValidation = validateEmail(value);
                return emailValidation.isValid ? undefined : emailValidation.error;
            case 'password':
                const passwordValidation = validateRequired(value, 'Password');
                return passwordValidation.isValid ? undefined : passwordValidation.error;
            default:
                return undefined;
        }
    };

    // Handle field changes with validation
    const handleFieldChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear errors when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }

        // Validate on change for touched fields
        if (touchedFields[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    // Handle field blur with validation
    const handleFieldBlur = (name: string, value: string) => {
        setTouchedFields(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    // Validate entire form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Validate email
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            newErrors.email = emailValidation.error;
        }

        // Validate password
        const passwordValidation = validateRequired(formData.password, 'Password');
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.error;
        }

        setErrors(newErrors);
        setTouchedFields({ email: true, password: true });

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        await login(formData);
    };

    // Show loading screen after successful authentication
    if (showLoading) {
        return <LoginLoading onComplete={completeLogin} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back to Landing Link */}
                <div className="text-center mb-4">
                    <Link
                        href="/landing"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>

                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
                        <FaServer className="text-2xl text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome to Pinger
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Sign in to monitor your services
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                    {/* Main Error Alert */}
                    {error && (
                        <FormAlert
                            type="error"
                            title="Login Failed"
                            message={error}
                            className="mb-6"
                        />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <FormInput
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            onBlur={(e) => handleFieldBlur('email', e.target.value)}
                            error={errors.email}
                            leftIcon={<HiMail />}
                            placeholder="Enter your email address"
                            required
                            autoComplete="email"
                            validator={(value) => validateEmail(value)}
                            validateOnBlur
                        />

                        {/* Password Field */}
                        <FormInput
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => handleFieldChange('password', e.target.value)}
                            onBlur={(e) => handleFieldBlur('password', e.target.value)}
                            error={errors.password}
                            leftIcon={<HiLockClosed />}
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                            validator={(value) => validateRequired(value, 'Password')}
                            validateOnBlur
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <FaShieldAlt className="h-4 w-4" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link
                                href="/auth/register"
                                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            >
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        🔒 Secure • 📊 Real-time Monitoring • 📧 Instant Alerts
                    </p>
                </div>
            </div>
        </div>
    );
}
