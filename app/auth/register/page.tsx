'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserPlus, FaServer } from 'react-icons/fa';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { registerUser } from '@/requests/auth';
import { FormInput } from '@/components/ui/FormInput';
import { FormAlert, PasswordStrengthIndicator } from '@/components/ui/ErrorComponents';
import { validateEmail, validatePassword, validatePasswordConfirmation } from '@/utils/validation';

interface RegisterForm {
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterForm>({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string>('');

    const router = useRouter();

    // Validate individual fields
    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'email':
                const emailValidation = validateEmail(value);
                return emailValidation.isValid ? undefined : emailValidation.error;
            case 'password':
                const passwordValidation = validatePassword(value);
                return passwordValidation.isValid ? undefined : passwordValidation.error;
            case 'confirmPassword':
                const confirmValidation = validatePasswordConfirmation(formData.password, value);
                return confirmValidation.isValid ? undefined : confirmValidation.error;
            default:
                return undefined;
        }
    };

    // Handle field changes with validation
    const handleFieldChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear server error when user starts typing
        if (serverError) {
            setServerError('');
        }

        // Clear field errors when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }

        // Validate on change for touched fields
        if (touchedFields[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }

        // Special case: if password changes, revalidate confirm password
        if (name === 'password' && touchedFields.confirmPassword) {
            const confirmError = validatePasswordConfirmation(value, formData.confirmPassword);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError.isValid ? undefined : confirmError.error }));
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
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.error;
        }

        // Validate password confirmation
        const confirmValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword);
        if (!confirmValidation.isValid) {
            newErrors.confirmPassword = confirmValidation.error;
        }

        setErrors(newErrors);
        setTouchedFields({ email: true, password: true, confirmPassword: true });

        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setServerError('');

        try {
            const response = await registerUser({
                email: formData.email,
                password: formData.password,
            });

            if (response.statusCode === 201) {
                toast.success('Account created successfully! Please sign in.');
                router.push('/auth/login');
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            setServerError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back to Landing Link */}
                <div className="text-center mb-4">
                    <Link
                        href="/landing"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>

                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4 shadow-lg">
                        <FaServer className="text-2xl text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Join Pinger
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Create your account to start monitoring
                    </p>
                </div>

                {/* Registration Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                    {/* Server Error Alert */}
                    {serverError && (
                        <FormAlert
                            type="error"
                            title="Registration Failed"
                            message={serverError}
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
                            isLoading={isLoading}
                        />

                        {/* Password Field */}
                        <div>
                            <FormInput
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={(e) => handleFieldChange('password', e.target.value)}
                                onBlur={(e) => handleFieldBlur('password', e.target.value)}
                                error={errors.password}
                                leftIcon={<HiLockClosed />}
                                placeholder="Create a strong password"
                                required
                                autoComplete="new-password"
                                validator={(value) => validatePassword(value)}
                                validateOnBlur
                                isLoading={isLoading}
                            />

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <PasswordStrengthIndicator
                                    password={formData.password}
                                    showFeedback
                                    className="mt-2"
                                />
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <FormInput
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                            onBlur={(e) => handleFieldBlur('confirmPassword', e.target.value)}
                            error={errors.confirmPassword}
                            leftIcon={<HiLockClosed />}
                            placeholder="Confirm your password"
                            required
                            autoComplete="new-password"
                            validator={(value) => validatePasswordConfirmation(formData.password, value)}
                            validateOnBlur
                            isLoading={isLoading}
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-success disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <FaUserPlus className="h-4 w-4" />
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link
                                href="/auth/login"
                                className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="mt-8 text-center">
                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center">
                            <span className="text-green-500 mb-1">🚀</span>
                            <span>Quick Setup</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-blue-500 mb-1">📊</span>
                            <span>Real-time</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-purple-500 mb-1">🔔</span>
                            <span>Instant Alerts</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
