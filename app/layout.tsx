import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PrelineScript } from "@/components/PrelineScripts";
import ToastProvider from "@/utils/ToastProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pinger - Service Health Monitor",
  description: "Professional service monitoring and health checking dashboard",
  keywords: "monitoring, health check, service, uptime, dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <ThemeProvider>
          <AppProvider>
            <ToastProvider>
              {children}
              <PrelineScript />
            </ToastProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
