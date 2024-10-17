"use client"

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

interface ToastProviderProps {
    children: React.ReactNode
}

export default function ToastProvider({ children }: ToastProviderProps) {
    const contextClass = {
        success: "bg-green-600 text-white",
        error: "bg-red-600 text-white",
        info: "bg-blue-600 text-white",
        warning: "bg-yellow-600 text-white",
        default: "bg-indigo-600 text-white",
        dark: "bg-white text-gray-800"
    }

    return (
        <>
            <ToastContainer
                toastClassName={(context) =>
                    `${contextClass[context?.type || "default"]} relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden bg-primary cursor-pointer shadow-lg`}
                bodyClassName={() => "text-sm font-medium block p-3"}
                position="top-center"
                autoClose={5000}
            />
            {children}
        </>


    )
}