'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/HeaderNew';
import { Sidebar } from '@/components/SidebarNew';
import { Wrapper } from '@/components/Wrapper';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { loggedIn, token } = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loggedIn || !token) {
            router.push('/auth/login');
        }
    }, [loggedIn, token, router]);

    if (!loggedIn || !token) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:ml-0">
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                <main className="p-6">
                    <Wrapper>
                        {children}
                    </Wrapper>
                </main>
            </div>
        </div>
    );
}
