import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CTASectionProps {
    isDarkMode: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({ isDarkMode }) => {
    return (
        <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="container mx-auto px-6">
                <motion.div
                    className="max-w-4xl mx-auto text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    {/* Main CTA Content */}
                    <div className={`relative p-12 rounded-3xl overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'
                        }`}>
                        {/* Background Elements */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
                        <div className="absolute top-4 left-4 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
                        <div className="absolute bottom-4 right-4 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl" />

                        {/* Content */}
                        <div className="relative z-10">
                            <motion.h2
                                className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                Ready to Monitor Your Services?
                            </motion.h2>

                            <motion.p
                                className={`text-xl mb-8 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                Join thousands of developers who trust Pinger to keep their services running smoothly.
                                Get started in minutes, no credit card required.
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <Link href="/auth/register">
                                    <motion.button
                                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Start Free Trial
                                    </motion.button>
                                </Link>

                                <Link href="/auth/login">
                                    <motion.button
                                        className={`px-8 py-4 border-2 font-semibold rounded-xl transition-all duration-300 ${isDarkMode
                                                ? 'border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white hover:bg-gray-800'
                                                : 'border-gray-300 text-gray-700 hover:border-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Sign In
                                    </motion.button>
                                </Link>
                            </motion.div>

                            {/* Features List */}
                            <motion.div
                                className="flex flex-wrap justify-center gap-6 text-sm"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                {[
                                    '✓ Free forever plan',
                                    '✓ No setup fees',
                                    '✓ Cancel anytime',
                                    '✓ 24/7 support'
                                ].map((feature, index) => (
                                    <motion.span
                                        key={index}
                                        className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                                        viewport={{ once: true }}
                                    >
                                        {feature}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
