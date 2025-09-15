// Resource preloading utilities
export const preloadRoute = (route: string) => {
  if (typeof window !== "undefined") {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = route;
    document.head.appendChild(link);
  }
};

// Preload critical routes
export const preloadCriticalRoutes = () => {
  if (typeof window !== "undefined") {
    const criticalRoutes = ["/dashboard", "/admin/users", "/admin/emails", "/landing"];

    criticalRoutes.forEach((route) => {
      setTimeout(() => preloadRoute(route), 2000); // Preload after 2 seconds
    });
  }
};

// Image optimization utilities
export const optimizeImage = (
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "auto";
  } = {}
) => {
  const { width, height, quality = 75, format = "auto" } = options;

  // For Next.js Image component
  const params = new URLSearchParams();
  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  params.set("q", quality.toString());
  if (format !== "auto") params.set("f", format);

  return `${src}?${params.toString()}`;
};

// Memory management utilities
export const cleanupMemory = () => {
  // Clear API cache
  if (typeof window !== "undefined") {
    // Force garbage collection if available (dev tools)
    if ("gc" in window) {
      (window as any).gc();
    }

    // Clear unused event listeners
    document.querySelectorAll("[data-cleanup]").forEach((element) => {
      element.remove();
    });
  }
};

// Performance monitoring
export class PerformanceMonitor {
  private metrics = new Map<string, number[]>();

  mark(name: string) {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(name);
    }
  }

  measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== "undefined" && "performance" in window) {
      try {
        const measurement = performance.measure(name, startMark, endMark);

        // Store metrics
        if (!this.metrics.has(name)) {
          this.metrics.set(name, []);
        }
        this.metrics.get(name)!.push(measurement.duration);

        // Log slow operations
        if (measurement.duration > 1000) {
          console.warn(`🐌 Slow operation: ${name} took ${measurement.duration}ms`);
        }

        return measurement.duration;
      } catch (error) {
        console.warn("Performance measurement failed:", error);
        return 0;
      }
    }
    return 0;
  }

  getMetrics() {
    const summary = new Map<string, { avg: number; min: number; max: number; count: number }>();

    this.metrics.forEach((values, name) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      summary.set(name, { avg, min, max, count: values.length });
    });

    return summary;
  }

  reset() {
    this.metrics.clear();
    if (typeof window !== "undefined" && "performance" in window) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
import { useEffect, useRef } from "react";

export const usePerformanceMonitor = (componentName: string) => {
  const mountTime = useRef<number>();

  useEffect(() => {
    mountTime.current = performance.now();
    performanceMonitor.mark(`${componentName}-mount-start`);

    return () => {
      if (mountTime.current) {
        performanceMonitor.mark(`${componentName}-mount-end`);
        performanceMonitor.measure(
          `${componentName}-mount-duration`,
          `${componentName}-mount-start`,
          `${componentName}-mount-end`
        );
      }
    };
  }, [componentName]);

  const measureRender = (renderName: string = "render") => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      if (duration > 16) {
        // Longer than one frame (16ms)
        console.warn(`🎨 Slow render: ${componentName}-${renderName} took ${duration}ms`);
      }
    };
  };

  return { measureRender };
};

// Service Worker utilities for caching
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered:", registration);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
};

// Web Vitals tracking
export const trackWebVitals = (metric: any) => {
  // Send to analytics
  if (process.env.NODE_ENV === "production") {
    console.log("Web Vital:", metric);

    // You can send to your analytics service here
    // Example: gtag('event', metric.name, { value: metric.value });
  }
};

// Resource hints for critical resources
export const addResourceHints = () => {
  if (typeof document !== "undefined") {
    // Preconnect to external domains
    const preconnectDomains = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];

    preconnectDomains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = domain;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });

    // DNS prefetch for likely next destinations
    const dnsPrefetchDomains = ["//api.example.com", "//cdn.example.com"];

    dnsPrefetchDomains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = domain;
      document.head.appendChild(link);
    });
  }
};
