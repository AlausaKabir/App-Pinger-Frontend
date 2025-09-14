import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface HeroSectionProps {
    isDarkMode: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isDarkMode }) => {
    const fadeIn = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${isDarkMode
                            ? 'from-gray-900 via-blue-900/20 to-purple-900/20'
                            : 'from-blue-50 via-white to-purple-50'
                        }`}
                />
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            </div>

            {/* Floating Elements */}
            <motion.div
                className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"
                animate={{
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
                animate={{
                    y: [0, 20, 0],
                    scale: [1, 0.9, 1],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            {/* Content */}
            <motion.div
                className="container mx-auto px-6 text-center z-10"
                variants={stagger}
                initial="initial"
                animate="animate"
            >
                <motion.div variants={fadeIn}>
                    <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Pinger
                        </span>
                        <br />
                        <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                            Monitor Everything
                        </span>
                    </h1>
                </motion.div>

                <motion.p
                    className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                    variants={fadeIn}
                >
                    Real-time service monitoring with instant alerts, comprehensive analytics,
                    and enterprise-grade security. Keep your services running smoothly 24/7.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                    variants={fadeIn}
                >
                    <Link href="/auth/register">
                        <motion.button
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started Free
                        </motion.button>
                    </Link>

                    <Link href="/auth/login">
                        <motion.button
                            className={`px-8 py-4 border-2 font-semibold rounded-xl transition-all duration-300 ${isDarkMode
                                    ? 'border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white'
                                    : 'border-gray-300 text-gray-700 hover:border-gray-500 hover:text-gray-900'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Sign In
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Status Indicator */}
                <motion.div
                    className="flex items-center justify-center gap-2"
                    variants={fadeIn}
                >
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        All systems operational
                    </span>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
