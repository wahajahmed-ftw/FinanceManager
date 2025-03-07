"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define the context type with "grey" theme
interface ThemeContextType {
  theme: "light" | "dark" | "grey";
  toggleTheme: () => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook for easy usage
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark" | "grey">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark" | "grey") || "light";
    }
    return "light";
  });

  // Apply theme changes
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark", "grey");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Function to toggle theme: Light → Dark → Grey → Light
  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "light" ? "dark" : prevTheme === "dark" ? "grey" : "light"
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
