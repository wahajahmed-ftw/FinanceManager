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
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
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

      <AnimatePresence>
        {ripple && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
            initial={{
              opacity: 0.5,
              scale: 0,
              x: ripple.x,
              y: ripple.y,
            }}
            animate={{
              opacity: [0.5, 0.2, 0], // Gradual fade out
              scale: 30, // Expands fully
              x: "50%",
              y: "50%",
              transform: "translate(-50%, -50%)",
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5, // Slow, elegant expansion
              ease: [0.22, 1, 0.36, 1], // Natural, fluid motion
            }}
          >
            <div className="absolute w-[300px] h-[300px] bg-primary rounded-full opacity-30 backdrop-blur-lg"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  );
}
