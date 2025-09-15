import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Loading components for better UX
export const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
);

export const LoadingCard = () => (
    <div className="animate-pulse">
        <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
        <div className="space-y-2">
            <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-3/4"></div>
            <div className="bg-gray-300 dark:bg-gray-700 h-4 rounded w-1/2"></div>
        </div>
    </div>
);

// Lazy-loaded components with loading states
export const LazyLandingPage = dynamic(() => import('@/app/landing/page'), {
    loading: () => <LoadingSpinner />,
    ssr: true, // Enable SSR for SEO
});

export const LazyAdminUsers = dynamic(() => import('@/app/admin/users/page'), {
    loading: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <LoadingCard key={i} />
            ))}
        </div>
    ),
    ssr: false, // Admin pages don't need SSR
});

export const LazyDashboard = dynamic(() => import('@/app/dashboard/page'), {
    loading: () => <LoadingSpinner />,
    ssr: false,
});

export const LazyAnalytics = dynamic(() => import('@/app/dashboard/analytics/page'), {
    loading: () => (
        <div className="space-y-6">
            <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-64 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-300 dark:bg-gray-700 h-32 rounded-lg"></div>
                ))}
            </div>
        </div>
    ),
    ssr: false,
});

// Modal components - only load when needed
export const LazyMissionCriticalModal = dynamic(
    () => import('@/components/modals/MissionCriticalModal'),
    {
        loading: () => <LoadingSpinner />,
        ssr: false,
    }
);

// Heavy feature components
export const LazyFeaturesSection = dynamic(
    () => import('@/components/landing/FeaturesSection'),
    {
        loading: () => <LoadingCard />,
        ssr: true, // Important for SEO
    }
);

export const LazyLiveDemoSection = dynamic(
    () => import('@/components/landing/LiveDemoSection'),
    {
        loading: () => <LoadingCard />,
        ssr: true,
    }
);

// Utility component for wrapping lazy components with Suspense
export const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<LoadingSpinner />}>
        {children}
    </Suspense>
);
