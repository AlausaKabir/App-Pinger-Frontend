"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

const ThemeContext = createContext<{ theme: string; toggleTheme: () => void }>({
    theme: "dark",
    toggleTheme: () => { },
});

interface ThemeProps {
    children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProps) => {
    const [mount, setMount] = useState(false);
    const [theme, setTheme] = useState<string>("light");

    useEffect(() => {
        setMount(true);
    }, []);

    useEffect(() => {
        if (mount) {
            if (typeof window !== "undefined") {
                const savedTheme = localStorage.getItem("hs_theme");

                if (savedTheme) {
                    setTheme(savedTheme);
                } else {
                    const prefersDark = window.matchMedia(
                        "(prefers-color-scheme: dark)"
                    ).matches;
                    if (prefersDark) {
                        setTheme("dark");
                        localStorage.setItem("hs_theme", "dark");
                    } else {
                        setTheme("light");
                        localStorage.setItem("hs_theme", "light");
                    }
                }

                const handleChange = (e: MediaQueryListEvent) => {
                    const newTheme = e.matches ? "dark" : "light";
                    setTheme(newTheme);
                    localStorage.setItem("hs_theme", newTheme);
                };

                const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
                mediaQuery.addEventListener("change", handleChange);

                return () => {
                    mediaQuery.removeEventListener("change", handleChange);
                };
            }
        }
    }, [mount]);

    useEffect(() => {
        localStorage.setItem("hs_theme", theme);
        const html = document.querySelector("html");
        if (!html) return;

        if (theme === "dark") {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
    }, [theme, mount]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            localStorage.setItem("hs_theme", newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export function NextThemeProviders({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </NextThemeProvider>
    );
}

export const useTheme = () => useContext(ThemeContext);
