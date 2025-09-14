import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

interface FooterProps {
    isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
    const footerSections = [
        {
            title: 'Product',
            links: [
                { name: 'Features', href: '#features' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'Demo', href: '#demo' },
                { name: 'API Docs', href: '/docs' }
            ]
        },
        {
            title: 'Company',
            links: [
                { name: 'About', href: '/about' },
                { name: 'Blog', href: '/blog' },
                { name: 'Careers', href: '/careers' },
                { name: 'Contact', href: '/contact' }
            ]
        },
        {
            title: 'Support',
            links: [
                { name: 'Help Center', href: '/help' },
                { name: 'Status Page', href: '/status' },
                { name: 'Community', href: '/community' },
                { name: 'Support', href: '/support' }
            ]
        },
        {
            title: 'Legal',
            links: [
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Cookie Policy', href: '/cookies' },
                { name: 'GDPR', href: '/gdpr' }
            ]
        }
    ];

    const socialLinks = [
        { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
        { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
        { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: FaEnvelope, href: 'mailto:hello@pinger.dev', label: 'Email' }
    ];

    return (
        <footer className={`relative overflow-hidden ${isDarkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-gray-50 border-t border-gray-200'
            }`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-grid-pattern" />
            </div>

            <div className="relative container mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <Link href="/" className="inline-block mb-4">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Pinger
                                </h3>
                            </Link>

                            <p className={`text-base mb-6 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                Monitor your services 24/7 with instant alerts, comprehensive analytics,
                                and enterprise-grade security. Keep your applications running smoothly.
                            </p>

                            {/* Social Links */}
                            <div className="flex gap-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${isDarkMode
                                                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-900'
                                            }`}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={social.label}
                                    >
                                        <social.icon className="text-lg" />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Footer Links */}
                    {footerSections.map((section, sectionIndex) => (
                        <motion.div
                            key={sectionIndex}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                {section.title}
                            </h4>

                            <ul className="space-y-3">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            href={link.href}
                                            className={`text-sm transition-colors duration-200 hover:underline ${isDarkMode
                                                    ? 'text-gray-400 hover:text-white'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter Section */}
                <motion.div
                    className={`p-8 rounded-2xl mb-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="max-w-2xl">
                        <h4 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            Stay Updated
                        </h4>
                        <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            Get the latest updates on new features, performance improvements, and monitoring best practices.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                                    }`}
                            />
                            <motion.button
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${isDarkMode ? 'border-gray-800' : 'border-gray-200'
                        }`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        © {new Date().getFullYear()} Pinger. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/privacy"
                            className={`text-sm transition-colors duration-200 ${isDarkMode
                                    ? 'text-gray-400 hover:text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms"
                            className={`text-sm transition-colors duration-200 ${isDarkMode
                                    ? 'text-gray-400 hover:text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Terms
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                All systems operational
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
