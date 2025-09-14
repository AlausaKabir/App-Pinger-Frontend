import { FaBolt, FaBell, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { Feature, Stat, ServiceStatus } from "@/types/landing.types";

export const FEATURES: Feature[] = [
  {
    icon: FaBolt,
    title: "Real-time Monitoring",
    description: "Monitor your services 24/7 with instant status updates and performance metrics.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: FaBell,
    title: "Instant Alerts",
    description: "Get notified immediately when your services go down via email notifications.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: FaChartLine,
    title: "Analytics Dashboard",
    description: "Comprehensive insights into your service performance and uptime statistics.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: FaShieldAlt,
    title: "Enterprise Security",
    description: "Role-based access control with admin and superadmin privileges.",
    gradient: "from-orange-500 to-red-500",
  },
];

export const STATS: Stat[] = [
  { value: "99.9%", label: "Uptime Guarantee" },
  { value: "<30s", label: "Alert Speed" },
  { value: "24/7", label: "Monitoring" },
  { value: "∞", label: "Services" },
];

export const MOCK_SERVICES: ServiceStatus[] = [
  { name: "API Service", status: "online", color: "green" },
  { name: "Database", status: "online", color: "green" },
  { name: "Payment Gateway", status: "down", color: "red" },
];
