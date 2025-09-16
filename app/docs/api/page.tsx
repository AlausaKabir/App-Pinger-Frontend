'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiServer,
    FiLock,
    FiZap,
    FiCopy,
    FiCheck,
    FiDatabase
} from 'react-icons/fi';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import LandingNav from '@/components/landing/LandingNav';

const ApiDocsPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const copyToClipboard = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const endpoints = [
        {
            category: "Authentication",
            icon: FiLock,
            color: "red",
            endpoints: [
                {
                    method: "POST",
                    path: "/auth/login",
                    description: "Authenticate user and receive JWT tokens",
                    code: `curl -X POST https://api.pinger.app/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'`,
                    response: `{
  "statusCode": 200,
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}`
                },
                {
                    method: "POST",
                    path: "/auth/register",
                    description: "Register new user account",
                    code: `curl -X POST https://api.pinger.app/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'`
                }
            ]
        },
        {
            category: "Service Monitoring",
            icon: FiServer,
            color: "blue",
            endpoints: [
                {
                    method: "GET",
                    path: "/service-check",
                    description: "Get all monitored services with health status",
                    code: `curl -X GET https://api.pinger.app/service-check \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json"`,
                    response: `{
  "statusCode": 200,
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "Production API",
      "url": "https://api.example.com/health",
      "healthStatus": "UP",
      "responseTime": 120,
      "lastChecked": "2025-09-16T10:30:00.000Z",
      "createdAt": "2025-09-01T09:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}`
                },
                {
                    method: "POST",
                    path: "/service-check",
                    description: "Add new service to monitor",
                    code: `curl -X POST https://api.pinger.app/service-check \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My API Service",
    "url": "https://api.myapp.com/health",
    "checkInterval": 60
  }'`
                }
            ]
        },
        {
            category: "Advanced Search",
            icon: FiZap,
            color: "purple",
            endpoints: [
                {
                    method: "GET",
                    path: "/search/global",
                    description: "Search across all entities (users, services, emails)",
                    code: `curl -X GET "https://api.pinger.app/search/global?search=production&entities=users,services" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
                    response: `{
  "statusCode": 200,
  "status": "success",
  "data": {
    "users": [...],
    "services": [...],
    "emails": [...],
    "totalResults": 25
  }
}`
                },
                {
                    method: "GET",
                    path: "/search/quick",
                    description: "Quick auto-complete search for real-time results",
                    code: `curl -X GET "https://api.pinger.app/search/quick?q=prod&limit=5" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`
                }
            ]
        },
        {
            category: "Analytics",
            icon: FiDatabase,
            color: "green",
            endpoints: [
                {
                    method: "GET",
                    path: "/analytics/dashboard",
                    description: "Get comprehensive dashboard analytics",
                    code: `curl -X GET https://api.pinger.app/analytics/dashboard \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
                    response: `{
  "statusCode": 200,
  "data": {
    "totalServices": 150,
    "activeServices": 147,
    "averageResponseTime": 89,
    "uptime": 99.87,
    "alerts": 2,
    "recentChecks": [...]
  }
}`
                }
            ]
        }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}>

            {/* Landing Navigation */}
            <LandingNav isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 pt-20">
                <div className="container mx-auto px-6 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            API Documentation
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                            Complete REST API reference with authentication, endpoints, and examples
                        </p>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Base URL</h3>
                            <code className="text-blue-700 dark:text-blue-300">https://api.pinger.app/v1</code>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* API Endpoints */}
            <div className="container mx-auto px-6 py-12">
                <div className="space-y-12">
                    {endpoints.map((category, categoryIndex) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-8">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${category.color}-500 to-${category.color}-600 flex items-center justify-center`}>
                                    <category.icon className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold">{category.category}</h2>
                            </div>

                            <div className="grid gap-8">
                                {category.endpoints.map((endpoint, endpointIndex) => (
                                    <div
                                        key={endpointIndex}
                                        className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                                    >
                                        {/* Endpoint Header */}
                                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${endpoint.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                                endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                            }`}>
                                                            {endpoint.method}
                                                        </span>
                                                        <code className="text-lg font-mono font-bold">{endpoint.path}</code>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-400">{endpoint.description}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Request Example */}
                                        <div className="p-6">
                                            <div className="mb-6">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-lg">Request Example</h4>
                                                    <button
                                                        onClick={() => copyToClipboard(endpoint.code, `request-${categoryIndex}-${endpointIndex}`)}
                                                        className="flex items-center gap-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                                    >
                                                        {copiedCode === `request-${categoryIndex}-${endpointIndex}` ? (
                                                            <>
                                                                <FiCheck className="h-4 w-4 text-green-600" />
                                                                <span className="text-sm">Copied!</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiCopy className="h-4 w-4" />
                                                                <span className="text-sm">Copy</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                                <pre className="bg-gray-900 dark:bg-gray-950 text-green-400 p-4 rounded-lg overflow-x-auto">
                                                    <code>{endpoint.code}</code>
                                                </pre>
                                            </div>

                                            {/* Response Example */}
                                            {endpoint.response && (
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-semibold text-lg">Response Example</h4>
                                                        <button
                                                            onClick={() => copyToClipboard(endpoint.response!, `response-${categoryIndex}-${endpointIndex}`)}
                                                            className="flex items-center gap-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                                        >
                                                            {copiedCode === `response-${categoryIndex}-${endpointIndex}` ? (
                                                                <>
                                                                    <FiCheck className="h-4 w-4 text-green-600" />
                                                                    <span className="text-sm">Copied!</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FiCopy className="h-4 w-4" />
                                                                    <span className="text-sm">Copy</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <pre className="bg-gray-900 dark:bg-gray-950 text-blue-400 p-4 rounded-lg overflow-x-auto">
                                                        <code>{endpoint.response}</code>
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Authentication Guide */}
                <motion.div
                    className="mt-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-xl p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <h3 className="text-2xl font-bold mb-6">Authentication Guide</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-semibold mb-3">JWT Token Usage</h4>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                <li>• Include JWT token in Authorization header</li>
                                <li>• Format: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Bearer YOUR_JWT_TOKEN</code></li>
                                <li>• Tokens expire in 24 hours</li>
                                <li>• Use refresh token to get new access token</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Security Features</h4>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                <li>• Rate limiting: 100 requests per minute</li>
                                <li>• Request signing for sensitive operations</li>
                                <li>• IP whitelisting for enterprise accounts</li>
                                <li>• Comprehensive audit logging</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ApiDocsPage;
