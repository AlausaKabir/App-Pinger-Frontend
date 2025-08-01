'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { FaServer, FaPlus, FaSync, FaEye, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { getServices, deleteService, Service } from '@/requests/services';
import { hasPermission, UserRole } from '@/utils/permissions';
import NavigationBar from '@/components/NavigationBar';

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { role } = useSelector((state: RootState) => state.user);
    const userRole = role as UserRole;
    const canDeleteServices = hasPermission(userRole, 'canDeleteServices');

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setIsLoading(true);
            const response = await getServices();
            if (response.statusCode === 200) {
                const servicesData = Array.isArray(response.data) ? response.data : [response.data];
                setServices(servicesData.filter(Boolean));
            }
        } catch (error: any) {
            console.error('Failed to load services:', error);
            if (error.response?.status === 404) {
                setServices([]);
            } else {
                toast.error('Failed to load services. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteService = async (serviceId: string, serviceName: string) => {
        if (!confirm(`Are you sure you want to delete "${serviceName}"?`)) return;

        try {
            const response = await deleteService(serviceId);
            if (response.statusCode === 200) {
                toast.success('Service deleted successfully!');
                await loadServices();
            }
        } catch (error: any) {
            console.error('Failed to delete service:', error);
            toast.error(error.response?.data?.message || 'Failed to delete service');
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadServices();
        setIsRefreshing(false);
        toast.success('Services refreshed!');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'UP':
                return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
            case 'DOWN':
                return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <NavigationBar />

            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Services Management
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Manage and monitor all your services
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                <FaSync className={isRefreshing ? 'animate-spin' : ''} />
                                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                            </button>
                            <Link
                                href="/dashboard/services/add"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                            >
                                <FaPlus />
                                <span>Add Service</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-12">
                        <FaServer className="text-6xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No services yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Get started by adding your first service to monitor
                        </p>
                        <Link
                            href="/dashboard/services/add"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
                        >
                            <FaPlus />
                            <span>Add First Service</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <FaServer className="text-blue-600 text-xl" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {service.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                                                {service.url}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(service.healthStatus)}`}>
                                        {service.healthStatus}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    <p>Added: {new Date(service.createdAt).toLocaleDateString()}</p>
                                    {service.updatedAt !== service.createdAt && (
                                        <p>Updated: {new Date(service.updatedAt).toLocaleDateString()}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => window.open(service.url, '_blank')}
                                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        title="View Service"
                                    >
                                        <FaEye className="h-4 w-4" />
                                    </button>
                                    {canDeleteServices && (
                                        <button
                                            onClick={() => handleDeleteService(service.id, service.name)}
                                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                            title="Delete Service"
                                        >
                                            <FaTrash className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
