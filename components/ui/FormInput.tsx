import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { ErrorMessage, SuccessMessage } from './ErrorComponents';

export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    error?: string;
    success?: string;
    isValid?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    helperText?: string;
    showValidation?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onValidatedChange?: (value: string, isValid: boolean) => void;
    validator?: (value: string) => { isValid: boolean; error?: string };
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
    label,
    error,
    success,
    isValid,
    isLoading = false,
    leftIcon,
    rightIcon,
    helperText,
    showValidation = true,
    onValidatedChange,
    validator,
    validateOnBlur = true,
    validateOnChange = false,
    containerClassName = '',
    labelClassName = '',
    inputClassName = '',
    type = 'text',
    className = '',
    onBlur,
    onChange,
    value,
    ...props
}, ref) => {
    const [internalValue, setInternalValue] = useState(value || '');
    const [internalError, setInternalError] = useState<string | undefined>();
    const [internalSuccess, setInternalSuccess] = useState<string | undefined>();
    const [isTouched, setIsTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const currentValue = value !== undefined ? value : internalValue;
    const currentError = error || internalError;
    const currentSuccess = success || internalSuccess;
    const hasError = Boolean(currentError && isTouched && showValidation);
    const hasSuccess = Boolean(currentSuccess && !hasError && isTouched && showValidation);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (value === undefined) {
            setInternalValue(newValue);
        }

        // Validate on change if enabled
        if (validateOnChange && validator) {
            const validation = validator(newValue);
            if (!validation.isValid) {
                setInternalError(validation.error);
                setInternalSuccess(undefined);
            } else {
                setInternalError(undefined);
                setInternalSuccess('Valid');
            }

            if (onValidatedChange) {
                onValidatedChange(newValue, validation.isValid);
            }
        }

        if (onChange) {
            onChange(e);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsTouched(true);
        setIsFocused(false);

        // Validate on blur if enabled
        if (validateOnBlur && validator) {
            const validation = validator(currentValue as string);
            if (!validation.isValid) {
                setInternalError(validation.error);
                setInternalSuccess(undefined);
            } else {
                setInternalError(undefined);
                setInternalSuccess('Valid');
            }

            if (onValidatedChange) {
                onValidatedChange(currentValue as string, validation.isValid);
            }
        }

        if (onBlur) {
            onBlur(e);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    // Determine input state classes
    const getInputStateClasses = () => {
        if (hasError) {
            return 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-900/10';
        }
        if (hasSuccess && isValid !== false) {
            return 'border-green-300 dark:border-green-600 focus:border-green-500 focus:ring-green-500/20 bg-green-50/50 dark:bg-green-900/10';
        }
        if (isFocused) {
            return 'border-blue-300 dark:border-blue-600 focus:border-blue-500 focus:ring-blue-500/20';
        }
        return 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20';
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <div className={`relative ${containerClassName}`}>
            {/* Label */}
            {label && (
                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${labelClassName}`}>
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Left Icon */}
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className={`w-5 h-5 ${hasError ? 'text-red-400' : hasSuccess ? 'text-green-400' : 'text-gray-400'}`}>
                            {leftIcon}
                        </div>
                    </div>
                )}

                {/* Input */}
                <input
                    ref={ref}
                    type={inputType}
                    value={currentValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className={`
            w-full px-4 py-3 rounded-lg transition-all duration-200
            ${leftIcon ? 'pl-10' : 'pl-4'}
            ${(rightIcon || type === 'password' || hasError || hasSuccess) ? 'pr-10' : 'pr-4'}
            ${getInputStateClasses()}
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${inputClassName}
            ${className}
          `}
                    disabled={isLoading}
                    {...props}
                />

                {/* Right Side Icons */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                    {/* Loading Spinner */}
                    {isLoading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                    )}

                    {/* Validation Icons */}
                    {!isLoading && showValidation && (
                        <>
                            {hasError && (
                                <FiAlertCircle className="w-5 h-5 text-red-400" />
                            )}
                            {hasSuccess && !hasError && (
                                <FiCheck className="w-5 h-5 text-green-400" />
                            )}
                        </>
                    )}

                    {/* Password Toggle */}
                    {type === 'password' && !isLoading && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {showPassword ? (
                                <FiEyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <FiEye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    )}

                    {/* Custom Right Icon */}
                    {rightIcon && !isLoading && type !== 'password' && (
                        <div className={`w-5 h-5 ${hasError ? 'text-red-400' : hasSuccess ? 'text-green-400' : 'text-gray-400'}`}>
                            {rightIcon}
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            <ErrorMessage
                message={currentError}
                show={hasError}
            />

            {/* Success Message */}
            <SuccessMessage
                message={currentSuccess}
                show={hasSuccess}
            />

            {/* Helper Text */}
            {helperText && !hasError && !hasSuccess && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {helperText}
                </p>
            )}
        </div>
    );
});

FormInput.displayName = 'FormInput';