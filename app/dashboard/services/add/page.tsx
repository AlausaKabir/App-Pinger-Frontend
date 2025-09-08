'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { FaServer, FaArrowLeft, FaGlobe, FaTag, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { addService } from '@/requests/services';
import { hasPermission, UserRole } from '@/utils/permissions';

export default function AddServicePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        method: 'GET',
        timeout: 5000,
        interval: 300000, // 5 minutes
        expectedStatus: 200,
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { role } = useSelector((state: RootState) => state.user);
    const userRole = role as UserRole;
    const canManageServices = hasPermission(userRole, 'canManageServices');

    // Redirect if user doesn't have permission
    if (!canManageServices) {
        router.push('/dashboard');
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'timeout' || name === 'interval' || name === 'expectedStatus'
                ? parseInt(value) || 0
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.url.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);

            const serviceData = {
                name: formData.name.trim(),
                url: formData.url.trim(),
                method: formData.method,
                timeout: formData.timeout,
                interval: formData.interval,
                expectedStatus: formData.expectedStatus,
                description: formData.description.trim()
            };

            const response = await addService(serviceData);

            if (response.statusCode === 201 || response.statusCode === 200) {
                toast.success('Service added successfully!');
                router.push('/dashboard/services');
            } else {
                toast.error('Failed to add service. Please try again.');
            }
        } catch (error: any) {
            console.error('Error adding service:', error);
            toast.error(error.response?.data?.message || 'Failed to add service. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatInterval = (milliseconds: number): string => {
        const minutes = Math.floor(milliseconds / 60000);
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        const hours = Math.floor(minutes / 60);
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard/services" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Add New Service
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Add a new service to monitor its health and uptime
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FaTag className="inline mr-2" />
                                        Service Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., My Website API"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FaGlobe className="inline mr-2" />
                                        Service URL *
                                    </label>
                                    <input
                                        type="url"
                                        id="url"
                                        name="url"
                                        value={formData.url}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/api/health"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Advanced Configuration */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="method" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        HTTP Method
                                    </label>
                                    <select
                                        id="method"
                                        name="method"
                                        value={formData.method}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                        <option value="DELETE">DELETE</option>
                                        <option value="HEAD">HEAD</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="expectedStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Expected Status Code
                                    </label>
                                    <input
                                        type="number"
                                        id="expectedStatus"
                                        name="expectedStatus"
                                        value={formData.expectedStatus}
                                        onChange={handleInputChange}
                                        min="100"
                                        max="599"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="timeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <FaClock className="inline mr-2" />
                                        Timeout (ms)
                                    </label>
                                    <input
                                        type="number"
                                        id="timeout"
                                        name="timeout"
                                        value={formData.timeout}
                                        onChange={handleInputChange}
                                        min="1000"
                                        max="60000"
                                        step="1000"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Check Interval */}
                            <div>
                                <label htmlFor="interval" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Check Interval
                                </label>
                                <div className="space-y-2">
                                    <select
                                        id="interval"
                                        name="interval"
                                        value={formData.interval}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value={60000}>1 minute</option>
                                        <option value={120000}>2 minutes</option>
                                        <option value={300000}>5 minutes</option>
                                        <option value={600000}>10 minutes</option>
                                        <option value={1800000}>30 minutes</option>
                                        <option value={3600000}>1 hour</option>
                                    </select>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Service will be checked every {formatInterval(formData.interval)}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="Brief description of what this service does..."
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                                >
                                    <FaServer />
                                    <span>{isSubmitting ? 'Adding Service...' : 'Add Service'}</span>
                                </button>

                                <Link
                                    href="/dashboard/services"
                                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                                >
                                    <FaArrowLeft />
                                    <span>Cancel</span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
                        Service Monitoring Tips
                    </h3>
                    <ul className="space-y-2 text-blue-800 dark:text-blue-400">
                        <li>• Use health check endpoints for better monitoring accuracy</li>
                        <li>• Set appropriate timeout values based on your service response times</li>
                        <li>• Choose check intervals that balance monitoring needs with server load</li>
                        <li>• Use descriptive names to easily identify services in your dashboard</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
