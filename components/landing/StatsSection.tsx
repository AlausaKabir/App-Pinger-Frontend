import React from 'react';
import { motion } from 'framer-motion';
import { Stat } from '@/types/landing.types';
import { STATS } from '@/constants/landing.constants';

interface StatsSectionProps {
    isDarkMode: boolean;
}

const StatsSection: React.FC<StatsSectionProps> = ({ isDarkMode }) => {
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1
        }
    };

    return (
        <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="container mx-auto px-6">
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {STATS.map((stat: Stat, index: number) => (
                        <motion.div
                            key={index}
                            className="text-center group"
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.div
                                className={`text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                {stat.value}
                            </motion.div>

                            <p className={`text-sm md:text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default StatsSection;
