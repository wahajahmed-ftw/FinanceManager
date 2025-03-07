"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define the context type
interface ThemeContextType {
  theme: "grey" | "dark";
  toggleTheme: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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
  const [theme, setTheme] = useState<"grey" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "grey" | "dark") || "grey";
    }
    return "grey";
  });

  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  // Apply theme changes
  useEffect(() => {
    document.documentElement.classList.remove("grey", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Function to toggle theme with ripple effect
  const toggleTheme = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const { clientX, clientY } = event; // Get click position

    setRipple({ x: clientX, y: clientY });

    setTimeout(() => {
      setTheme((prevTheme) => (prevTheme === "grey" ? "dark" : "grey"));
      setRipple(null);
    }, 500); // Matches animation duration
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}

      {/* Soft Ripple Effect */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
            initial={{
              opacity: 0.3,
              scale: 0,
              x: ripple.x - 20,
              y: ripple.y - 20,
            }}
            animate={{
              opacity: 0,
              scale: 25, // Soft expansion
              x: "50%",
              y: "50%",
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.2, // Slower ripple effect
              ease: "easeOut",
            }}
          >
            <div className="absolute w-full h-full bg-primary rounded-full"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  );
}
