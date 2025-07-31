'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { FaPlus, FaEnvelope, FaToggleOn, FaToggleOff, FaTrash, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAllNotificationEmails, registerEmail, toggleEmailStatus, deleteNotificationEmail, Email } from '@/requests/email';
import { hasPermission, UserRole } from '@/utils/permissions';

export default function EmailManagementPage() {
    const [emails, setEmails] = useState<Email[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const { user, role } = useSelector((state: RootState) => state.user);
    const userRole = role as UserRole;

    // Check if user has permission to manage emails
    const canManageEmails = hasPermission(userRole, 'canManageEmails');

    useEffect(() => {
        if (!canManageEmails) {
            toast.error('You do not have permission to manage notification emails');
            return;
        }
        loadEmails();
    }, [canManageEmails]);

    const loadEmails = async () => {
        try {
            setIsLoading(true);
            const response = await getAllNotificationEmails();
            if (response.statusCode === 200) {
                const emailsData = Array.isArray(response.data) ? response.data : [response.data];
                setEmails(emailsData.filter(Boolean));
            }
        } catch (error: any) {
            console.error('Failed to load emails:', error);
            if (error.response?.status === 404) {
                setEmails([]);
            } else {
                toast.error('Failed to load notification emails. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail.trim()) return;

        try {
            setIsAdding(true);
            const response = await registerEmail({ email: newEmail.trim() });

            if (response.statusCode === 201) {
                toast.success('Notification email added successfully!');
                setShowAddModal(false);
                setNewEmail('');
                await loadEmails();
            }
        } catch (error: any) {
            console.error('Failed to add email:', error);
            toast.error(error.response?.data?.message || 'Failed to add email. Please try again.');
        } finally {
            setIsAdding(false);
        }
    };

    const handleToggleStatus = async (emailId: string) => {
        try {
            const response = await toggleEmailStatus(emailId);
            if (response.statusCode === 200) {
                toast.success('Email status updated successfully!');
                await loadEmails();
            }
        } catch (error: any) {
            console.error('Failed to toggle email status:', error);
            toast.error(error.response?.data?.message || 'Failed to update email status.');
        }
    };

    const handleDeleteEmail = async (emailId: string) => {
        if (!confirm('Are you sure you want to delete this notification email?')) return;

        try {
            const response = await deleteNotificationEmail(emailId);
            if (response.statusCode === 200) {
                toast.success('Notification email deleted successfully!');
                await loadEmails();
            }
        } catch (error: any) {
            console.error('Failed to delete email:', error);
            toast.error(error.response?.data?.message || 'Failed to delete email.');
        }
    };

    if (!canManageEmails) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <FaShieldAlt className="text-6xl text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        You do not have permission to manage notification emails.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Email Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage notification email addresses for service alerts
                    </p>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Notification Emails ({emails.length})
                        </h2>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <FaPlus />
                        <span>Add Email</span>
                    </button>
                </div>

                {/* Emails Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : emails.length === 0 ? (
                    <div className="text-center py-12">
                        <FaEnvelope className="text-6xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No notification emails configured
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Add email addresses to receive service health notifications
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
                        >
                            <FaPlus />
                            <span>Add First Email</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {emails.map((email) => (
                            <div
                                key={email.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <FaEnvelope className="text-blue-600 text-xl" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white break-all">
                                                {email.email}
                                            </h3>
                                            <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${email.isActive
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                {email.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    <p>Added: {new Date(email.createdAt).toLocaleDateString()}</p>
                                    {email.updatedAt !== email.createdAt && (
                                        <p>Updated: {new Date(email.updatedAt).toLocaleDateString()}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => handleToggleStatus(email.id)}
                                        className={`flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium transition-colors ${email.isActive
                                                ? 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                                : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                            }`}
                                    >
                                        {email.isActive ? <FaToggleOff /> : <FaToggleOn />}
                                        <span>{email.isActive ? 'Disable' : 'Enable'}</span>
                                    </button>

                                    <button
                                        onClick={() => handleDeleteEmail(email.id)}
                                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition-colors"
                                        title="Delete email"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Email Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Add Notification Email
                            </h3>
                            <form onSubmit={handleAddEmail}>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    required
                                    disabled={isAdding}
                                />
                                <div className="flex justify-end space-x-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setNewEmail('');
                                        }}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                        disabled={isAdding}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isAdding || !newEmail.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                                    >
                                        {isAdding ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Adding...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaPlus />
                                                <span>Add Email</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
