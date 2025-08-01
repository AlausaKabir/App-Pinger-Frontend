'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { FaPlus, FaServer, FaCheckCircle, FaTimesCircle, FaClock, FaTrash, FaEye, FaSync, FaEnvelope, FaUsers } from 'react-icons/fa';
import { HiOutlineGlobeAlt } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { getServices, addService, deleteService, Service } from '@/requests/services';
import { hasPermission, UserRole } from '@/utils/permissions';
import NavigationBar from '@/components/NavigationBar';

export default function DashboardPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newService, setNewService] = useState({ name: '', url: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [autoRefresh, setAutoRefresh] = useState(true);

    const { role } = useSelector((state: RootState) => state.user);
    const userRole = role as UserRole;

    // Check permissions
    const canDeleteServices = hasPermission(userRole, 'canDeleteServices');

    // Load services from API
    const loadServices = async (silent = false) => {
        try {
            if (!silent) setIsLoading(true);
            const response = await getServices();
            if (response.statusCode === 200) {
                // Handle both single service and array responses
                const servicesData = Array.isArray(response.data) ? response.data : [response.data];
                setServices(servicesData.filter(Boolean)); // Filter out any null/undefined items
                setLastUpdated(new Date());
            }
        } catch (error: any) {
            console.error('Failed to load services:', error);
            if (error.response?.status === 404 || error.response?.data?.message?.includes('No services found')) {
                // No services found - this is normal for new users
                setServices([]);
                setLastUpdated(new Date());
            } else if (!silent) {
                toast.error('Failed to load services. Please try again.');
            }
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    // Auto-refresh effect - sync with backend every 30 seconds
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            loadServices(true); // Silent refresh to avoid loading states
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [autoRefresh]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Clear any ongoing intervals when component unmounts
        };
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadServices();
        setIsRefreshing(false);
        toast.success('Services refreshed!');
    };

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);

        try {
            const response = await addService({
                name: newService.name,
                url: newService.url,
            });

            if (response.statusCode === 201) {
                toast.success('Service added successfully!');
                setNewService({ name: '', url: '' });
                setShowAddModal(false);
                await loadServices(); // Refresh the list
            }
        } catch (error: any) {
            console.error('Failed to add service:', error);
            toast.error(error.response?.data?.message || 'Failed to add service');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteService = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            const response = await deleteService(id);
            if (response.statusCode === 200) {
                toast.success('Service deleted successfully!');
                await loadServices(); // Refresh the list
            }
        } catch (error: any) {
            console.error('Failed to delete service:', error);
            toast.error(error.response?.data?.message || 'Failed to delete service');
        }
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'UP':
                return <FaCheckCircle className="h-4 w-4" />;
            case 'DOWN':
                return <FaTimesCircle className="h-4 w-4" />;
            default:
                return <FaClock className="h-4 w-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <NavigationBar />

            <div className="max-w-7xl mx-auto p-6">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center space-x-3">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Service Dashboard
                                </h1>
                                <div className={`flex items-center space-x-2 ${autoRefresh ? 'status-live' : ''}`}>
                                    <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {autoRefresh ? 'Live' : 'Paused'}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Monitor your services in real-time • Last updated: {lastUpdated.toLocaleTimeString()}
                            </p>
                        </div>

                        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                            <button
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={`inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${autoRefresh
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                    }`}
                                title={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
                            >
                                <div className={`w-2 h-2 rounded-full mr-2 ${autoRefresh ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                Auto-refresh
                            </button>

                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaSync className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {isRefreshing ? 'Refreshing...' : 'Refresh'}
                            </button>

                            <button
                                onClick={() => setShowAddModal(true)}
                                className="btn-primary inline-flex items-center"
                            >
                                <FaPlus className="h-4 w-4 mr-2" />
                                Add Service
                            </button>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaServer className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Services</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{services.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaCheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Healthy Services</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {services.filter(s => s.healthStatus === 'UP').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaTimesCircle className="h-8 w-8 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Down Services</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {services.filter(s => s.healthStatus === 'DOWN').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-all duration-300 ${service.healthStatus === 'DOWN'
                                        ? 'service-down-intense border-red-500 dark:border-red-400'
                                        : service.healthStatus === 'UP'
                                            ? 'service-up border-green-200 dark:border-green-800'
                                            : 'border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {service.name}
                                            </h3>
                                            <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.healthStatus)}`}>
                                                {getStatusIcon(service.healthStatus)}
                                                <span className="ml-1">{service.healthStatus}</span>
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <HiOutlineGlobeAlt className="h-4 w-4 mr-1" />
                                            <span className="truncate">{service.url}</span>
                                        </div>

                                        <div className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                                            Last updated: {new Date(service.updatedAt).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
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
                            </div>
                        ))}

                        {services.length === 0 && (
                            <div className="col-span-full">
                                <div className="text-center py-12">
                                    <FaServer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        No services yet
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        Get started by adding your first service to monitor
                                    </p>
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="btn-primary inline-flex items-center"
                                    >
                                        <FaPlus className="h-4 w-4 mr-2" />
                                        Add Your First Service
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add Service Modal */}
                    {showAddModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Add New Service
                                </h3>

                                <form onSubmit={handleAddService} className="space-y-4">
                                    <div>
                                        <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Service Name
                                        </label>
                                        <input
                                            type="text"
                                            id="serviceName"
                                            value={newService.name}
                                            onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                                            className="input-field"
                                            placeholder="e.g., API Gateway"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="serviceUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Service URL
                                        </label>
                                        <input
                                            type="url"
                                            id="serviceUrl"
                                            value={newService.url}
                                            onChange={(e) => setNewService(prev => ({ ...prev, url: e.target.value }))}
                                            className="input-field"
                                            placeholder="https://your-service.com/health"
                                            required
                                        />
                                    </div>

                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isAdding}
                                            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isAdding ? 'Adding...' : 'Add Service'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
