'use client';

import { FaRocket, FaTools, FaCog, FaChartLine, FaUserShield } from 'react-icons/fa';
import { useState } from 'react';

interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName: string;
    description: string;
    icon?: React.ReactNode;
}

export function ComingSoonModal({ isOpen, onClose, featureName, description, icon }: ComingSoonModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                        {icon || <FaRocket className="text-blue-600 dark:text-blue-400 text-2xl" />}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {featureName}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {description}
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            <FaTools className="inline mr-2" />
                            This feature is under active development and will be available soon!
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ComingSoonButtonProps {
    children: React.ReactNode;
    featureName: string;
    description: string;
    icon?: React.ReactNode;
    className?: string;
}

export function ComingSoonButton({ children, featureName, description, icon, className }: ComingSoonButtonProps) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className={className}
            >
                {children}
            </button>

            <ComingSoonModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                featureName={featureName}
                description={description}
                icon={icon}
            />
        </>
    );
}

// Preset configurations for common features
export const ComingSoonFeatures = {
    Analytics: {
        name: "Analytics Dashboard",
        description: "Comprehensive service monitoring analytics with detailed insights, performance metrics, and trend analysis.",
        icon: <FaChartLine className="text-blue-600 dark:text-blue-400 text-2xl" />
    },
    Settings: {
        name: "System Settings",
        description: "Configure system-wide settings, notification preferences, and monitoring parameters.",
        icon: <FaCog className="text-blue-600 dark:text-blue-400 text-2xl" />
    },
    UserManagement: {
        name: "User Management",
        description: "Advanced user role management, permissions configuration, and team administration tools.",
        icon: <FaUserShield className="text-blue-600 dark:text-blue-400 text-2xl" />
    }
};
