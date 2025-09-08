'use client';

import Link from 'next/link';
import { FaChartLine, FaArrowLeft, FaClock, FaRocket } from 'react-icons/fa';

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Analytics
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Performance insights and service metrics
                            </p>
                        </div>
                    </div>
                </div>

                {/* Coming Soon Content */}
                <div className="max-w-2xl mx-auto text-center py-16">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 border border-gray-200 dark:border-gray-700">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
                                <FaChartLine className="text-3xl text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Analytics Dashboard
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                                We're building something amazing for you!
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-6 mb-8">
                            <div className="flex items-center justify-center mb-4">
                                <FaClock className="text-blue-600 dark:text-blue-400 mr-2" />
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">Coming Soon</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                Our analytics dashboard will provide comprehensive insights into your service performance,
                                including uptime statistics, response time trends, historical data analysis, and much more.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                    <FaRocket className="text-blue-600 dark:text-blue-400 mr-2" />
                                    What's Coming
                                </h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                    <li>• Service uptime analytics</li>
                                    <li>• Response time trends</li>
                                    <li>• Performance metrics</li>
                                    <li>• Historical data insights</li>
                                </ul>
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                    <FaChartLine className="text-green-600 dark:text-green-400 mr-2" />
                                    Features
                                </h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                    <li>• Real-time monitoring</li>
                                    <li>• Custom date ranges</li>
                                    <li>• Export capabilities</li>
                                    <li>• Alert summaries</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/dashboard"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                <FaArrowLeft className="mr-2" />
                                Back to Dashboard
                            </Link>
                            <Link
                                href="/dashboard/services"
                                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                View Services
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
