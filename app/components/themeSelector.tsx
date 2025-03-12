"use client";

import { useTheme } from "@/context/themeContext";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="w-14 h-14 flex items-center cursor-pointer justify-center rounded-full border-2 border-[var(--border)] shadow-lg transition-all duration-500 bg-[var(--background)] hover:shadow-xl hover:bg-[var(--card-bg-hover)]"
      whileTap={{ scale: 0.9 }} // Click effect
    >
      {/* Rotating Icon */}
      <motion.div
        className="text-[var(--foreground)]"
        animate={{ rotate: theme === "grey" ? 0 : 360 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        {theme === "grey" ? <Moon size={22} /> : <Sun size={22} />}
      </motion.div>
    </motion.button>
  );
}
