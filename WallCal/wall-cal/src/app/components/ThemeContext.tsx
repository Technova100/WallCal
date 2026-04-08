"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  explicitlySet: boolean;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [explicitlySet, setExplicitlySet] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem("wallcal_theme") as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      setExplicitlySet(true);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const isSysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setThemeState(isSysDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", isSysDark);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setExplicitlySet(true);
    localStorage.setItem("wallcal_theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, explicitlySet, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  // During SSR or first render before mount, context might be undefined.
  // We can return a default to avoid crashing.
  if (!context) {
    return { theme: "light" as Theme, explicitlySet: false, setTheme: () => {} };
  }
  return context;
}
