'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    FiCode,
    FiShield,
    FiZap,
    FiTrendingUp,
    FiUsers,
    FiServer,
    FiDatabase,
    FiGitBranch,
    FiMonitor,
    FiCloud,
    FiLock,
    FiArrowRight,
    FiStar,
    FiAward,
    FiTarget,
    FiGlobe,
    FiDollarSign
} from 'react-icons/fi';
import { useTheme } from '@/components/ThemeProvider';

const DocsPage: React.FC = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}>
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
                <motion.div
                    className="container mx-auto px-6 relative z-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="text-center max-w-4xl mx-auto" variants={itemVariants}>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Enterprise-Grade Architecture
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300">
                            Built with cutting-edge technologies, scalable infrastructure, and investor-grade security standards
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                                🚀 Production Ready
                            </span>
                            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                                💰 Investment Grade
                            </span>
                            <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                                📈 Scalable to Millions
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Technical Excellence Overview */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <motion.div
                    className="container mx-auto px-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div className="text-center mb-16" variants={itemVariants}>
                        <h2 className="text-4xl font-bold mb-6">Technical Superiority</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Every line of code written with enterprise standards, investor expectations, and billion-dollar scalability in mind
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FiCode,
                                title: "Modern Tech Stack",
                                description: "Next.js 14, TypeScript, NestJS, PostgreSQL, Redis - The same stack used by unicorn startups",
                                highlights: ["TypeScript 100%", "Enterprise Patterns", "Clean Architecture"],
                                color: "blue"
                            },
                            {
                                icon: FiShield,
                                title: "Bank-Level Security",
                                description: "JWT authentication, input sanitization, XSS protection, and role-based access control",
                                highlights: ["SOC 2 Ready", "GDPR Compliant", "Zero Trust"],
                                color: "green"
                            },
                            {
                                icon: FiZap,
                                title: "Performance First",
                                description: "Sub-100ms response times, efficient caching, optimized queries, and real-time updates",
                                highlights: ["99.9% Uptime", "Global CDN", "Edge Computing"],
                                color: "yellow"
                            },
                            {
                                icon: FiDatabase,
                                title: "Scalable Infrastructure",
                                description: "Microservices architecture, horizontal scaling, load balancing, and auto-scaling capabilities",
                                highlights: ["Docker Ready", "Kubernetes Native", "Cloud Agnostic"],
                                color: "purple"
                            },
                            {
                                icon: FiMonitor,
                                title: "Advanced Monitoring",
                                description: "Real-time analytics, comprehensive logging, performance monitoring, and predictive alerts",
                                highlights: ["24/7 Monitoring", "AI Predictions", "Custom Dashboards"],
                                color: "red"
                            },
                            {
                                icon: FiGitBranch,
                                title: "DevOps Excellence",
                                description: "CI/CD pipelines, automated testing, code quality gates, and deployment automation",
                                highlights: ["100% Test Coverage", "Auto Deployment", "Quality Gates"],
                                color: "indigo"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className={`p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300`}
                                variants={itemVariants}
                                whileHover={{ y: -5, scale: 1.02 }}
                            >
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 flex items-center justify-center mb-4`}>
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                                <div className="space-y-2">
                                    {feature.highlights.map((highlight, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <FiStar className="h-4 w-4 text-yellow-500" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Architecture Deep Dive */}
            <section className="py-20">
                <motion.div
                    className="container mx-auto px-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div className="text-center mb-16" variants={itemVariants}>
                        <h2 className="text-4xl font-bold mb-6">System Architecture</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Enterprise-grade architecture designed for global scale and investor confidence
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div variants={itemVariants}>
                            <h3 className="text-2xl font-bold mb-6">Backend Excellence</h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        title: "NestJS Framework",
                                        desc: "Enterprise TypeScript framework with decorators, dependency injection, and modular architecture"
                                    },
                                    {
                                        title: "PostgreSQL + Prisma ORM",
                                        desc: "Type-safe database queries with automatic migrations and performance optimization"
                                    },
                                    {
                                        title: "JWT Authentication",
                                        desc: "Stateless authentication with role-based access control and refresh token rotation"
                                    },
                                    {
                                        title: "Advanced Search Engine",
                                        desc: "Full-text search with auto-complete, filtering, pagination, and real-time results"
                                    },
                                    {
                                        title: "Real-time Monitoring",
                                        desc: "Automated service health checks with instant notifications and recovery actions"
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <FiAward className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                            <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <h3 className="text-2xl font-bold mb-6">Frontend Innovation</h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        title: "Next.js 14 with App Router",
                                        desc: "Server-side rendering, static generation, and optimized performance out of the box"
                                    },
                                    {
                                        title: "TypeScript 100%",
                                        desc: "Complete type safety from database to UI with zero runtime type errors"
                                    },
                                    {
                                        title: "Advanced Search UI",
                                        desc: "Auto-search with 5-character trigger, keyboard shortcuts, and intelligent filtering"
                                    },
                                    {
                                        title: "Real-time Dashboard",
                                        desc: "Live service status updates, comprehensive analytics, and interactive charts"
                                    },
                                    {
                                        title: "Responsive Design",
                                        desc: "Mobile-first approach with dark mode support and accessibility compliance"
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <FiTarget className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                            <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Investment Highlights */}
            <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
                <motion.div
                    className="container mx-auto px-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div className="text-center mb-16" variants={itemVariants}>
                        <h2 className="text-4xl font-bold mb-6">Why Investors Love This</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Built with the same standards and technologies that power billion-dollar companies
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: FiTrendingUp,
                                title: "Market Ready",
                                value: "Enterprise Scale",
                                description: "Architecture designed to handle millions of users and thousands of services simultaneously"
                            },
                            {
                                icon: FiDollarSign,
                                title: "Revenue Model",
                                value: "SaaS + Enterprise",
                                description: "Multiple revenue streams with high customer lifetime value and predictable recurring revenue"
                            },
                            {
                                icon: FiGlobe,
                                title: "Global Market",
                                value: "$50B+ TAM",
                                description: "Massive total addressable market in monitoring, DevOps, and infrastructure management"
                            },
                            {
                                icon: FiUsers,
                                title: "Team Quality",
                                value: "Expert Developers",
                                description: "Built by experienced engineers who understand both technology and business needs"
                            }
                        ].map((highlight, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                                variants={itemVariants}
                                whileHover={{ y: -5, scale: 1.05 }}
                            >
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                                    <highlight.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{highlight.title}</h3>
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">{highlight.value}</div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{highlight.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Technical Documentation Links */}
            <section className="py-20">
                <motion.div
                    className="container mx-auto px-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div className="text-center mb-16" variants={itemVariants}>
                        <h2 className="text-4xl font-bold mb-6">Dive Deeper</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Explore detailed documentation, API references, and technical deep-dives
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: "API Documentation",
                                description: "Complete REST API documentation with interactive examples and authentication guides",
                                link: "/docs/api",
                                icon: FiCode,
                                badge: "RESTful API"
                            },
                            {
                                title: "Architecture Guide",
                                description: "Deep dive into system architecture, database design, and scalability patterns",
                                link: "/docs/architecture",
                                icon: FiServer,
                                badge: "System Design"
                            },
                            {
                                title: "Security Framework",
                                description: "Comprehensive security implementation including JWT, RBAC, and data protection",
                                link: "/docs/security",
                                icon: FiLock,
                                badge: "Enterprise Security"
                            },
                            {
                                title: "Deployment Guide",
                                description: "Production deployment guides for Docker, Kubernetes, and cloud providers",
                                link: "/docs/deployment",
                                icon: FiCloud,
                                badge: "DevOps Ready"
                            },
                            {
                                title: "Performance Benchmarks",
                                description: "Load testing results, performance metrics, and optimization strategies",
                                link: "/docs/performance",
                                icon: FiZap,
                                badge: "High Performance"
                            },
                            {
                                title: "Business Model",
                                description: "Revenue projections, market analysis, and growth strategy documentation",
                                link: "/docs/business",
                                icon: FiTrendingUp,
                                badge: "Investment Ready"
                            }
                        ].map((doc, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <Link
                                    href={doc.link}
                                    className="block p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                            <doc.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                                            {doc.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {doc.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {doc.description}
                                    </p>
                                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                                        <span>Explore</span>
                                        <FiArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <motion.div
                    className="container mx-auto px-6 text-center"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div variants={itemVariants}>
                        <h2 className="text-4xl font-bold text-white mb-6">Ready to Invest in Excellence?</h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            This is just the beginning. Every technical decision made with scale, security, and investor returns in mind.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/auth/register"
                                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Start Free Trial
                                <FiArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#contact"
                                className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-all duration-300"
                            >
                                Schedule Demo
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
};

export default DocsPage;
