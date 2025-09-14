'use client';

import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import StatsSection from '@/components/landing/StatsSection';
import LiveDemoSection from '@/components/landing/LiveDemoSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

/**
 * Landing Page Component
 * 
 * A comprehensive landing page showcasing Pinger's service monitoring capabilities.
 * Features a modern design with smooth animations, responsive layout, and clean architecture.
 * 
 * Key Features:
 * - Responsive design with mobile-first approach
 * - Dark/light theme support with smooth transitions
 * - Framer Motion animations for enhanced UX
 * - Modular component architecture for maintainability
 * - SEO-optimized with proper semantic HTML
 * - Performance-optimized with lazy loading and efficient rendering
 */
const LandingPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}>
            {/* Navigation */}
            <LandingNav isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <HeroSection isDarkMode={isDarkMode} />

                {/* Stats Section */}
                <StatsSection isDarkMode={isDarkMode} />

                {/* Features Section */}
                <section id="features">
                    <FeaturesSection isDarkMode={isDarkMode} />
                </section>

                {/* Live Demo Section */}
                <section id="demo">
                    <LiveDemoSection isDarkMode={isDarkMode} />
                </section>

                {/* Call to Action Section */}
                <section id="pricing">
                    <CTASection isDarkMode={isDarkMode} />
                </section>
            </main>

            {/* Footer */}
            <Footer isDarkMode={isDarkMode} />
        </div>
    );
};

export default LandingPage;
