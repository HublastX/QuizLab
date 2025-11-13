"use client";

import { useEffect } from "react";

const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";
const DARK = "dark";
const LIGHT = "light";

const updateTheme = (isDark: boolean) => {
    const theme = isDark ? DARK : LIGHT;

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
};

export function ThemeWatcher() {
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY);
        const applyTheme = (isDark: boolean) => {
            updateTheme(isDark);
        };

        applyTheme(mediaQuery.matches);

        const listener = (event: MediaQueryListEvent) => {
            applyTheme(event.matches);
        };

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", listener);
            return () => mediaQuery.removeEventListener("change", listener);
        }

        mediaQuery.addListener(listener);
        return () => mediaQuery.removeListener(listener);
    }, []);

    return null;
}
