"use client";
'use client';

import React, { ReactNode, createContext, useContext, useState } from 'react';
import { ValidationMiddleware, SecuritySchemas, XSSProtection } from '@/utils/security';
import { z } from 'zod';

// 🛡️ SECURITY CONTEXT
interface SecurityContextType {
    validateForm: <T>(schema: z.ZodSchema<T>, data: unknown) => { success: boolean; data?: T; errors?: string[] };
    sanitizeContent: (content: string) => string;
    isSecureEnvironment: boolean;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSecureEnvironment] = useState(() => {
        // Check if we're in a secure environment
        return typeof window !== 'undefined' &&
            window.location.protocol === 'https:' &&
            window.isSecureContext;
    });

    const contextValue: SecurityContextType = {
        validateForm: ValidationMiddleware.validateForm,
        sanitizeContent: XSSProtection.sanitizeUserContent,
        isSecureEnvironment
    };

    return (
        <SecurityContext.Provider value={contextValue}>
            {children}
        </SecurityContext.Provider>
    );
};

export const useSecurity = () => {
    const context = useContext(SecurityContext);
    if (!context) {
        throw new Error('useSecurity must be used within a SecurityProvider');
    }
    return context;
};

// 🔐 SECURE FORM COMPONENT
interface SecureFormProps {
    children: ReactNode;
    onSubmit: (data: any) => void;
    validationSchema?: z.ZodSchema<any>;
    className?: string;
}

export const SecureForm: React.FC<SecureFormProps> = ({
    children,
    onSubmit,
    validationSchema,
    className = ''
}) => {
    const { validateForm } = useSecurity();
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors([]);

        const formData = new FormData(event.currentTarget);
        const data: Record<string, any> = {};

        // Extract form data
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        // Validate if schema provided
        if (validationSchema) {
            const validation = validateForm(validationSchema, data);
            if (!validation.success) {
                setErrors(validation.errors || ['Validation failed']);
                return;
            }
            onSubmit(validation.data);
        } else {
            onSubmit(data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={className} noValidate>
            {errors.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="text-red-800 text-sm">
                        <p className="font-semibold">Please fix the following errors:</p>
                        <ul className="mt-1 list-disc list-inside">
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {children}
        </form>
    );
};

// 🔐 SECURE INPUT COMPONENT
interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    sanitize?: boolean;
}

export const SecureInput: React.FC<SecureInputProps> = ({
    label,
    error,
    sanitize = true,
    className = '',
    onChange,
    ...props
}) => {
    const { sanitizeContent } = useSecurity();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (sanitize && onChange) {
            const sanitizedValue = sanitizeContent(event.target.value);
            const sanitizedEvent = {
                ...event,
                target: {
                    ...event.target,
                    value: sanitizedValue
                }
            };
            onChange(sanitizedEvent as any);
        } else if (onChange) {
            onChange(event);
        }
    };

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <input
                {...props}
                onChange={handleChange}
                className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
                autoComplete={props.autoComplete || "off"}
                spellCheck={false}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

// 🔐 SECURE TEXTAREA COMPONENT
interface SecureTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    sanitize?: boolean;
}

export const SecureTextarea: React.FC<SecureTextareaProps> = ({
    label,
    error,
    sanitize = true,
    className = '',
    onChange,
    ...props
}) => {
    const { sanitizeContent } = useSecurity();

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (sanitize && onChange) {
            const sanitizedValue = sanitizeContent(event.target.value);
            const sanitizedEvent = {
                ...event,
                target: {
                    ...event.target,
                    value: sanitizedValue
                }
            };
            onChange(sanitizedEvent as any);
        } else if (onChange) {
            onChange(event);
        }
    };

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <textarea
                {...props}
                onChange={handleChange}
                className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          resize-vertical
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
                spellCheck={false}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

// 🛡️ SECURE DISPLAY COMPONENT (for user content)
interface SecureDisplayProps {
    content: string;
    className?: string;
    as?: 'div' | 'span' | 'p';
}

export const SecureDisplay: React.FC<SecureDisplayProps> = ({
    content,
    className = '',
    as: Component = 'div'
}) => {
    const { sanitizeContent } = useSecurity();
    const sanitizedContent = sanitizeContent(content);

    return (
        <Component
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
    );
};

// 🔐 LOGIN FORM COMPONENT
export const SecureLoginForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
    return (
        <SecureForm
            onSubmit={onSubmit}
            validationSchema={SecuritySchemas.loginSchema}
            className="space-y-6"
        >
            <SecureInput
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                required
                autoComplete="username"
            />
            <SecureInput
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
            />
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
                Sign In
            </button>
        </SecureForm>
    );
};

// 🔐 REGISTRATION FORM COMPONENT
export const SecureRegisterForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
    return (
        <SecureForm
            onSubmit={onSubmit}
            validationSchema={SecuritySchemas.registerSchema}
            className="space-y-6"
        >
            <SecureInput
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                required
                autoComplete="username"
            />
            <SecureInput
                name="password"
                type="password"
                label="Password"
                placeholder="Create a password"
                required
                autoComplete="new-password"
            />
            <SecureInput
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
            />
            <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
                Create Account
            </button>
        </SecureForm>
    );
};
