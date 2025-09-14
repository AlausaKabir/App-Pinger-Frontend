import React from 'react';
import { motion } from 'framer-motion';
import { ServiceStatus } from '@/types/landing.types';
import { MOCK_SERVICES } from '@/constants/landing.constants';

interface LiveDemoSectionProps {
    isDarkMode: boolean;
}

const LiveDemoSection: React.FC<LiveDemoSectionProps> = ({ isDarkMode }) => {
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0
        }
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'online':
                return 'text-green-500';
            case 'down':
                return 'text-red-500';
            case 'warning':
                return 'text-yellow-500';
            default:
                return 'text-gray-500';
        }
    };

    const getStatusDot = (status: string): string => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'down':
                return 'bg-red-500';
            case 'warning':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        Live Service
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {' '}Dashboard
                        </span>
                    </h2>
                    <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        See Pinger in action with real-time service monitoring and status updates.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className={`rounded-2xl p-8 border ${isDarkMode
                                ? 'bg-gray-800 border-gray-700'
                                : 'bg-white border-gray-200 shadow-xl'
                            }`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {/* Dashboard Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Service Status Dashboard
                                </h3>
                                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    Last updated: {new Date().toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                    Live
                                </span>
                            </div>
                        </div>

                        {/* Services List */}
                        <motion.div
                            className="space-y-4"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {MOCK_SERVICES.map((service: ServiceStatus, index: number) => (
                                <motion.div
                                    key={index}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${isDarkMode
                                            ? 'bg-gray-750 border-gray-600 hover:bg-gray-700'
                                            : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                                        }`}
                                    variants={itemVariants}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-4 h-4 rounded-full ${getStatusDot(service.status)} ${service.status === 'online' ? 'animate-pulse' : ''
                                            }`} />
                                        <div>
                                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                {service.name}
                                            </h4>
                                            <p className={`text-sm ${getStatusColor(service.status)}`}>
                                                {service.status === 'online' ? 'Operational' : 'Service Down'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                            Response: {Math.floor(Math.random() * 100) + 50}ms
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${service.status === 'online'
                                                ? isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                                                : isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {service.status.toUpperCase()}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Demo Notice */}
                        <motion.div
                            className={`mt-8 p-4 rounded-xl border-dashed border-2 text-center ${isDarkMode
                                    ? 'border-gray-600 bg-gray-800/50'
                                    : 'border-gray-300 bg-gray-50/50'
                                }`}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                🚀 This is a live demo. Sign up to monitor your own services!
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LiveDemoSection;
