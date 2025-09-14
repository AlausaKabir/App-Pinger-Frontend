import React from 'react';
import { motion } from 'framer-motion';
import { Feature } from '@/types/landing.types';
import { FEATURES } from '@/constants/landing.constants';

interface FeaturesSectionProps {
    isDarkMode: boolean;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ isDarkMode }) => {
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0
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
                        Powerful Features for
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {' '}Reliable Monitoring
                        </span>
                    </h2>
                    <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        Everything you need to keep your services running smoothly and your users happy.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {FEATURES.map((feature: Feature, index: number) => (
                        <motion.div
                            key={index}
                            className={`relative group p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${isDarkMode
                                    ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                                    : 'bg-white hover:shadow-xl border border-gray-100'
                                }`}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                            {/* Icon */}
                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="text-2xl text-white" />
                            </div>

                            {/* Content */}
                            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                {feature.title}
                            </h3>

                            <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                {feature.description}
                            </p>

                            {/* Hover Arrow */}
                            <motion.div
                                className={`mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                initial={{ x: -10 }}
                                whileHover={{ x: 0 }}
                            >
                                <div className={`inline-flex items-center text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                    }`}>
                                    Learn more
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesSection;
