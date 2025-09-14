import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface LandingNavProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const LandingNav: React.FC<LandingNavProps> = ({ isDarkMode, toggleTheme }) => {
    const navItems = [
        { name: 'Features', href: '#features' },
        { name: 'Demo', href: '#demo' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Docs', href: '/docs' }
    ];

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${isDarkMode
                    ? 'bg-gray-900/80 border-b border-gray-800'
                    : 'bg-white/80 border-b border-gray-200'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">P</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Pinger
                            </span>
                        </Link>
                    </motion.div>

                    {/* Navigation Items - Hidden on mobile */}
                    <motion.div
                        className="hidden md:flex items-center gap-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`text-sm font-medium transition-colors duration-200 hover:scale-105 ${isDarkMode
                                        ? 'text-gray-300 hover:text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </motion.div>

                    {/* Right Section */}
                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        {/* Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-all duration-300 ${isDarkMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </motion.button>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            <Link href="/auth/login">
                                <motion.button
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isDarkMode
                                            ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Sign In
                                </motion.button>
                            </Link>

                            <Link href="/auth/register">
                                <motion.button
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                    whileHover={{ scale: 1.05, y: -1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Get Started
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    );
};

export default LandingNav;
