'use client';

export default function TestPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    🔧 Pinger Test Page
                </h1>

                <div className="grid gap-6">
                    {/* CSS Test */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">CSS Classes Test</h2>
                        <div className="space-y-4">
                            <button className="btn-primary">Primary Button</button>
                            <button className="btn-success">Success Button</button>
                            <button className="btn-danger">Danger Button</button>
                            <input className="input-field" placeholder="Test input field" />
                            <div className="status-up px-3 py-1 rounded-full inline-block">UP Status</div>
                            <div className="status-down px-3 py-1 rounded-full inline-block ml-2">DOWN Status</div>
                        </div>
                    </div>

                    {/* Environment Test */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Environment Test</h2>
                        <div className="space-y-2 text-sm">
                            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
                            <p><strong>Environment:</strong> {process.env.NODE_ENV || 'Not set'}</p>
                        </div>
                    </div>

                    {/* Navigation Test */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Navigation Test</h2>
                        <div className="space-y-2">
                            <a href="/auth/login" className="block text-blue-600 hover:underline">Login Page</a>
                            <a href="/auth/register" className="block text-blue-600 hover:underline">Register Page</a>
                            <a href="/dashboard" className="block text-blue-600 hover:underline">Dashboard</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
