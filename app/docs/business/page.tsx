'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FiTrendingUp,
    FiDollarSign,
    FiUsers,
    FiGlobe,
    FiArrowLeft,
    FiTarget,
    FiPieChart,
    FiBarChart,
    FiStar,
    FiShield,
    FiZap,
    FiAward
} from 'react-icons/fi';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

const BusinessDocsPage: React.FC = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const revenueProjections = [
        { year: '2024', arr: '$50K', customers: 150, avgContractValue: '$333' },
        { year: '2025', arr: '$500K', customers: 1200, avgContractValue: '$417' },
        { year: '2026', arr: '$2.5M', customers: 4500, avgContractValue: '$556' },
        { year: '2027', arr: '$8M', customers: 12000, avgContractValue: '$667' },
        { year: '2028', arr: '$25M', customers: 30000, avgContractValue: '$833' },
    ];

    const competitiveAdvantages = [
        {
            title: "Advanced Auto-Search Technology",
            description: "Revolutionary 5-character trigger search system - industry first",
            impact: "40% faster user workflows",
            icon: FiZap,
            color: "yellow"
        },
        {
            title: "Enterprise-Grade Security",
            description: "Bank-level security with SOC 2 compliance from day one",
            impact: "Access to Fortune 500 market",
            icon: FiShield,
            color: "green"
        },
        {
            title: "Modern Tech Stack",
            description: "Built on Next.js 14, NestJS, TypeScript - developer-friendly",
            impact: "Lower development costs",
            icon: FiStar,
            color: "purple"
        },
        {
            title: "Scalable Architecture",
            description: "Microservices architecture ready for global scale",
            impact: "Supports millions of users",
            icon: FiAward,
            color: "blue"
        }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}>
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-6 py-8">
                    <Link
                        href="/docs"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                        Back to Documentation
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            Investment Opportunity
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                            Comprehensive business model, market analysis, and growth projections for investor evaluation
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Market Opportunity */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-6">Market Opportunity</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Addressing a massive and growing market in DevOps, monitoring, and infrastructure management
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {[
                            {
                                title: "Total Addressable Market",
                                value: "$50.7B",
                                subtitle: "DevOps & Monitoring Market",
                                description: "Growing at 24.5% CAGR through 2028",
                                icon: FiGlobe,
                                color: "blue"
                            },
                            {
                                title: "Serviceable Market",
                                value: "$15.2B",
                                subtitle: "SMB & Mid-Market Focus",
                                description: "Underserved segment with high growth potential",
                                icon: FiTarget,
                                color: "purple"
                            },
                            {
                                title: "Market Growth",
                                value: "24.5%",
                                subtitle: "Annual Growth Rate",
                                description: "Driven by digital transformation initiatives",
                                icon: FiTrendingUp,
                                color: "green"
                            },
                            {
                                title: "Target Customers",
                                value: "2.5M+",
                                subtitle: "Potential Businesses",
                                description: "SMBs to enterprises needing monitoring",
                                icon: FiUsers,
                                color: "red"
                            }
                        ].map((metric, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${metric.color}-400 to-${metric.color}-600 flex items-center justify-center mx-auto mb-4`}>
                                    <metric.icon className="h-8 w-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold mb-2">{metric.value}</div>
                                <h3 className="font-semibold mb-2">{metric.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{metric.subtitle}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{metric.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Revenue Model */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-6">Revenue Model</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Multiple revenue streams with predictable SaaS metrics and high customer lifetime value
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 mb-12">
                        {/* Pricing Tiers */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold mb-6">SaaS Pricing Tiers</h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        tier: "Starter",
                                        price: "$29/month",
                                        features: ["Up to 10 services", "Basic monitoring", "Email alerts", "Dashboard access"],
                                        targetMarket: "Small businesses & startups"
                                    },
                                    {
                                        tier: "Professional",
                                        price: "$99/month",
                                        features: ["Up to 100 services", "Advanced analytics", "SMS + Email alerts", "API access", "Custom dashboards"],
                                        targetMarket: "Growing companies",
                                        popular: true
                                    },
                                    {
                                        tier: "Enterprise",
                                        price: "$399/month",
                                        features: ["Unlimited services", "White-label solution", "Priority support", "Custom integrations", "SLA guarantees"],
                                        targetMarket: "Large enterprises"
                                    }
                                ].map((tier, index) => (
                                    <div key={index} className={`p-6 rounded-xl border ${tier.popular ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-xl font-bold">{tier.tier}</h4>
                                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tier.price}</p>
                                            </div>
                                            {tier.popular && (
                                                <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">Most Popular</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{tier.targetMarket}</p>
                                        <ul className="text-sm space-y-1">
                                            {tier.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Additional Revenue Streams */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold mb-6">Additional Revenue Streams</h3>
                            <div className="space-y-6">
                                {[
                                    {
                                        stream: "Professional Services",
                                        revenue: "$150-500/hour",
                                        description: "Custom integrations, consulting, and implementation services",
                                        margin: "80% gross margin"
                                    },
                                    {
                                        stream: "White-Label Licensing",
                                        revenue: "$10K-50K/license",
                                        description: "License our platform to agencies and service providers",
                                        margin: "95% gross margin"
                                    },
                                    {
                                        stream: "Enterprise Add-ons",
                                        revenue: "$50-200/month",
                                        description: "Advanced features, compliance modules, custom reporting",
                                        margin: "90% gross margin"
                                    },
                                    {
                                        stream: "Data & Analytics",
                                        revenue: "$0.10/API call",
                                        description: "Premium analytics and benchmarking data",
                                        margin: "85% gross margin"
                                    }
                                ].map((stream, index) => (
                                    <div key={index} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold">{stream.stream}</h4>
                                            <span className="text-green-600 dark:text-green-400 font-bold">{stream.revenue}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stream.description}</p>
                                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">{stream.margin}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Financial Projections */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-6">5-Year Financial Projections</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Conservative growth projections based on comparable SaaS companies and market analysis
                        </p>
                    </motion.div>

                    {/* Revenue Projections Table */}
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-12"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <h3 className="text-2xl font-bold">Annual Recurring Revenue (ARR) Projections</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="text-left p-4 font-semibold">Year</th>
                                        <th className="text-left p-4 font-semibold">ARR</th>
                                        <th className="text-left p-4 font-semibold">Customers</th>
                                        <th className="text-left p-4 font-semibold">Avg Contract Value</th>
                                        <th className="text-left p-4 font-semibold">Growth Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {revenueProjections.map((projection, index) => (
                                        <motion.tr
                                            key={projection.year}
                                            className="border-t border-gray-200 dark:border-gray-700"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <td className="p-4 font-semibold">{projection.year}</td>
                                            <td className="p-4 text-2xl font-bold text-green-600 dark:text-green-400">{projection.arr}</td>
                                            <td className="p-4">{projection.customers.toLocaleString()}</td>
                                            <td className="p-4">{projection.avgContractValue}</td>
                                            <td className="p-4">
                                                {index > 0 && (
                                                    <span className="text-green-600 dark:text-green-400 font-semibold">
                                                        {Math.round(((parseInt(projection.arr.replace(/[$K,M]/g, '')) / (projection.arr.includes('M') ? 1 : 0.001)) /
                                                            (parseInt(revenueProjections[index - 1].arr.replace(/[$K,M]/g, '')) / (revenueProjections[index - 1].arr.includes('M') ? 1 : 0.001)) - 1) * 100)}%
                                                    </span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Key Metrics */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                metric: "Customer LTV",
                                value: "$15,000",
                                description: "Average customer lifetime value",
                                icon: FiUsers
                            },
                            {
                                metric: "CAC Payback",
                                value: "8 months",
                                description: "Customer acquisition cost recovery",
                                icon: FiDollarSign
                            },
                            {
                                metric: "Gross Margin",
                                value: "85%",
                                description: "Industry-leading profitability",
                                icon: FiPieChart
                            },
                            {
                                metric: "Net Revenue Retention",
                                value: "120%",
                                description: "Strong expansion revenue",
                                icon: FiBarChart
                            }
                        ].map((metric, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                                    <metric.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-2xl font-bold mb-2">{metric.value}</div>
                                <h4 className="font-semibold mb-2">{metric.metric}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Competitive Advantages */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-6">Competitive Advantages</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Technical and strategic advantages that create sustainable competitive moats
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {competitiveAdvantages.map((advantage, index) => (
                            <motion.div
                                key={index}
                                className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${advantage.color}-400 to-${advantage.color}-600 flex items-center justify-center flex-shrink-0`}>
                                        <advantage.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{advantage.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-3">{advantage.description}</p>
                                        <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                                            {advantage.impact}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Investment Ask */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
                <motion.div
                    className="container mx-auto px-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold text-white mb-6">Investment Opportunity</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Seeking $2M seed funding to accelerate product development, expand the team, and capture market share
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {[
                            {
                                title: "Funding Use",
                                items: ["Product development (40%)", "Sales & marketing (35%)", "Team expansion (25%)"]
                            },
                            {
                                title: "18-Month Goals",
                                items: ["$2M ARR", "500+ customers", "15-person team"]
                            },
                            {
                                title: "Expected Returns",
                                items: ["10x revenue growth", "Market leadership", "Series A readiness"]
                            }
                        ].map((section, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                                <ul className="text-blue-100 space-y-2">
                                    {section.items.map((item, idx) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="#contact"
                            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all duration-300"
                        >
                            Schedule Investor Meeting
                        </Link>
                        <Link
                            href="/docs/api"
                            className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-all duration-300"
                        >
                            View Technical Details
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default BusinessDocsPage;
