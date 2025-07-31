"use client";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/redux/store';

interface AppProviderProps {
    children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    return (
        <Provider store={store}>
            <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}