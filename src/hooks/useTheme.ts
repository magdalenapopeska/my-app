import { useEffect, useState } from "react";

const THEME_KEY = "theme-preference";

export function useTheme() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === "dark" || saved === "light") setTheme(saved);
        else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
        }
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    return { theme, toggle: () => setTheme(t => t === "dark" ? "light" : "dark") };
}
