'use client';

import { useEffect, useState } from 'react';
import { FaServer, FaCheckCircle, FaSpinner } from 'react-icons/fa';

interface LoginLoadingProps {
    onComplete?: () => void;
}

export default function LoginLoading({ onComplete }: LoginLoadingProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const loadingSteps = [
        { label: 'Authenticating user...', icon: FaSpinner, delay: 800 },
        { label: 'Loading dashboard...', icon: FaSpinner, delay: 1000 },
        { label: 'Fetching services...', icon: FaSpinner, delay: 1200 },
        { label: 'Preparing workspace...', icon: FaSpinner, delay: 800 },
        { label: 'Ready!', icon: FaCheckCircle, delay: 500 },
    ];

    useEffect(() => {
        let progressInterval: NodeJS.Timeout;
        let stepTimeout: NodeJS.Timeout;

        // Smooth progress animation
        progressInterval = setInterval(() => {
            setProgress(prev => {
                const target = ((currentStep + 1) / loadingSteps.length) * 100;
                const newProgress = Math.min(prev + 2, target);
                return newProgress;
            });
        }, 50);

        // Move to next step
        if (currentStep < loadingSteps.length - 1) {
            stepTimeout = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, loadingSteps[currentStep].delay);
        } else if (currentStep === loadingSteps.length - 1) {
            // Complete loading
            setTimeout(() => {
                onComplete?.();
            }, loadingSteps[currentStep].delay);
        }

        return () => {
            clearInterval(progressInterval);
            clearTimeout(stepTimeout);
        };
    }, [currentStep, onComplete]);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center z-50">
            <div className="text-center">
                {/* Logo Animation */}
                <div className="relative mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl shadow-2xl animate-pulse">
                        <FaServer className="text-3xl text-white" />
                    </div>

                    {/* Floating dots animation */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                    <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
                </div>

                {/* Welcome Message */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome to Pinger! 🚀
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Setting up your monitoring dashboard...
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-80 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                        data-progress={progress}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Loading Steps */}
                <div className="space-y-4">
                    {loadingSteps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;

                        return (
                            <div
                                key={index}
                                className={`flex items-center justify-center space-x-3 transition-all duration-300 ${isActive
                                        ? 'text-blue-600 dark:text-blue-400 scale-110'
                                        : isCompleted
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-gray-400 dark:text-gray-600'
                                    }`}
                            >
                                <Icon
                                    className={`h-5 w-5 ${isActive && step.icon === FaSpinner ? 'animate-spin' : ''
                                        }`}
                                />
                                <span className="text-sm font-medium">
                                    {step.label}
                                </span>
                                {isCompleted && (
                                    <FaCheckCircle className="h-4 w-4 text-green-500" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Fun Loading Message */}
                <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
                    {progress < 25 && "🔐 Verifying credentials..."}
                    {progress >= 25 && progress < 50 && "📊 Loading your data..."}
                    {progress >= 50 && progress < 75 && "🔧 Configuring services..."}
                    {progress >= 75 && progress < 100 && "✨ Almost ready..."}
                    {progress >= 100 && "🎉 Welcome aboard!"}
                </div>

                {/* Percentage */}
                <div className="mt-4">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
