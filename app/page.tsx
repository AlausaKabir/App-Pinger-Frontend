'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { FaServer } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const { loggedIn, token } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (loggedIn && token) {
      router.push('/dashboard');
    } else {
      router.push('/landing');
    }
  }, [loggedIn, token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg animate-pulse">
          <FaServer className="text-2xl text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pinger
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Redirecting...
        </p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
