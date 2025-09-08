'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle, FaTimes, FaEnvelope, FaArrowRight, FaShieldAlt } from 'react-icons/fa';

interface MissionCriticalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSkip: () => void;
}

export default function MissionCriticalModal({ isOpen, onClose, onSkip }: MissionCriticalModalProps) {
    const router = useRouter();
    const [isClosing, setIsClosing] = useState(false);

    const handleSetupNow = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            router.push('/admin/emails');
        }, 300);
    };

    const handleSkip = () => {
        setIsClosing(true);
        setTimeout(() => {
            onSkip();
        }, 300);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'
                }`} />

            {/* Modal */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                }`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 overflow-hidden">

                    {/* Header with animated warning */}
                    <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={handleSkip}
                                className="text-white/80 hover:text-white transition-colors p-1"
                            >
                                <FaTimes className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <FaExclamationTriangle className="h-8 w-8 text-white animate-pulse" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold">!</span>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-1">Mission Critical Setup</h2>
                                <p className="text-white/90 text-sm">System Configuration Required</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="mb-6">
                            <div className="flex items-start space-x-3 mb-4">
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mt-1">
                                    <FaEnvelope className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        No Notification Emails Configured
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        Your monitoring system needs notification emails to alert you when services go down.
                                        Without this, you won't know about critical failures!
                                    </p>
                                </div>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <FaShieldAlt className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    <span className="font-medium text-amber-800 dark:text-amber-300 text-sm">
                                        Why This Matters
                                    </span>
                                </div>
                                <ul className="text-amber-700 dark:text-amber-400 text-sm space-y-1">
                                    <li>• Get instant alerts when services fail</li>
                                    <li>• Monitor system health effectively</li>
                                    <li>• Ensure rapid incident response</li>
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={handleSetupNow}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl"
                            >
                                <FaEnvelope className="h-4 w-4" />
                                <span>Set Up Notification Emails Now</span>
                                <FaArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={handleSkip}
                                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors"
                            >
                                I'll Set This Up Later
                            </button>
                        </div>

                        {/* Footer note */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                            You can always configure this later in Admin → Email Management
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
