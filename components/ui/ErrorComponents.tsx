import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiAlertCircle,
    FiCheckCircle,
    FiInfo,
    FiAlertTriangle,
    FiX
} from 'react-icons/fi';

export interface ErrorMessageProps {
    message?: string;
    show?: boolean;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    show = true,
    className = ''
}) => {
    return (
        <AnimatePresence>
            {show && message && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2 text-sm text-red-600 dark:text-red-400 mt-1 ${className}`}
                >
                    <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export interface SuccessMessageProps {
    message?: string;
    show?: boolean;
    className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
    message,
    show = true,
    className = ''
}) => {
    return (
        <AnimatePresence>
            {show && message && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2 text-sm text-green-600 dark:text-green-400 mt-1 ${className}`}
                >
                    <FiCheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export interface InfoMessageProps {
    message?: string;
    show?: boolean;
    className?: string;
}

export const InfoMessage: React.FC<InfoMessageProps> = ({
    message,
    show = true,
    className = ''
}) => {
    return (
        <AnimatePresence>
            {show && message && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2 text-sm text-blue-600 dark:text-blue-400 mt-1 ${className}`}
                >
                    <FiInfo className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export interface WarningMessageProps {
    message?: string;
    show?: boolean;
    className?: string;
}

export const WarningMessage: React.FC<WarningMessageProps> = ({
    message,
    show = true,
    className = ''
}) => {
    return (
        <AnimatePresence>
            {show && message && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400 mt-1 ${className}`}
                >
                    <FiAlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export interface FormAlertProps {
    type: 'error' | 'success' | 'info' | 'warning';
    title?: string;
    message: string;
    show?: boolean;
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
}

export const FormAlert: React.FC<FormAlertProps> = ({
    type,
    title,
    message,
    show = true,
    dismissible = false,
    onDismiss,
    className = ''
}) => {
    const styles = {
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
        warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
    };

    const icons = {
        error: <FiAlertCircle className="w-5 h-5" />,
        success: <FiCheckCircle className="w-5 h-5" />,
        info: <FiInfo className="w-5 h-5" />,
        warning: <FiAlertTriangle className="w-5 h-5" />
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`relative p-4 rounded-lg border ${styles[type]} ${className}`}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            {icons[type]}
                        </div>
                        <div className="flex-1">
                            {title && (
                                <h4 className="font-semibold mb-1">{title}</h4>
                            )}
                            <p className="text-sm">{message}</p>
                        </div>
                        {dismissible && onDismiss && (
                            <button
                                onClick={onDismiss}
                                className="flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export interface PasswordStrengthIndicatorProps {
    password: string;
    showFeedback?: boolean;
    className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
    password,
    showFeedback = true,
    className = ''
}) => {
    // Import the password strength function
    const getPasswordStrength = (password: string) => {
        if (!password) {
            return { score: 0, feedback: ['Enter a password'], color: 'red' as const };
        }

        let score = 0;
        const feedback: string[] = [];

        // Length check
        if (password.length >= 8) {
            score += 1;
        } else {
            feedback.push('Use at least 8 characters');
        }

        // Lowercase check
        if (/[a-z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Add lowercase letters');
        }

        // Uppercase check
        if (/[A-Z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Add uppercase letters');
        }

        // Number check
        if (/\d/.test(password)) {
            score += 1;
        } else {
            feedback.push('Add numbers');
        }

        // Special character check
        if (/[^a-zA-Z0-9]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Add special characters');
        }

        // Determine color and final feedback
        let color: 'red' | 'orange' | 'yellow' | 'green' = 'red';

        if (score >= 4) {
            color = 'green';
            feedback.length = 0;
            feedback.push('Strong password!');
        } else if (score >= 3) {
            color = 'yellow';
        } else if (score >= 2) {
            color = 'orange';
        }

        return { score: Math.min(score, 4), feedback, color };
    };

    const strength = getPasswordStrength(password);

    const colorClasses = {
        red: 'bg-red-500',
        orange: 'bg-orange-500',
        yellow: 'bg-yellow-500',
        green: 'bg-green-500'
    };

    const strengthLabels = {
        0: 'Very Weak',
        1: 'Weak',
        2: 'Fair',
        3: 'Good',
        4: 'Strong'
    };

    return (
        <div className={`mt-2 ${className}`}>
            {/* Strength Bar */}
            <div className="flex gap-1 mb-2">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 flex-1 rounded-full transition-colors duration-200 ${index < strength.score
                                ? colorClasses[strength.color]
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                    />
                ))}
            </div>

            {/* Strength Label */}
            <div className="flex justify-between items-center text-xs">
                <span className={`font-medium ${strength.color === 'red' ? 'text-red-600 dark:text-red-400' :
                        strength.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                            strength.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-green-600 dark:text-green-400'
                    }`}>
                    {strengthLabels[strength.score as keyof typeof strengthLabels]}
                </span>
            </div>

            {/* Feedback */}
            {showFeedback && strength.feedback.length > 0 && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2"
                    >
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            {strength.feedback.map((feedback, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                                    {feedback}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};