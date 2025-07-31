export default function SimplePage() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Service Monitor - Test Page
                </h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">✅ CSS Compilation Fixed</h2>
                    <p className="text-gray-600">
                        If you can see this page, the CSS compilation issues have been resolved!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <span className="font-medium text-green-800">Service Online</span>
                        </div>
                        <p className="text-green-600 text-sm mt-2">All systems operational</p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                            <span className="font-medium text-yellow-800">Service Warning</span>
                        </div>
                        <p className="text-yellow-600 text-sm mt-2">Minor issues detected</p>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                            <span className="font-medium text-red-800">Service Down</span>
                        </div>
                        <p className="text-red-600 text-sm mt-2">Service unavailable</p>
                    </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h3>
                    <ul className="text-blue-800 space-y-1">
                        <li>• Authentication pages are ready at /auth/login and /auth/register</li>
                        <li>• Dashboard is available at /dashboard</li>
                        <li>• API integration is configured</li>
                        <li>• Redux store is set up for state management</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
