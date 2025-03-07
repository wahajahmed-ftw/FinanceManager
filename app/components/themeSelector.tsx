"use client";

import { useTheme } from "@/context/themeContext";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={toggleTheme}
            className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-[var(--border)] shadow-lg transition-all duration-300 bg-[var(--background)]"
            whileTap={{ scale: 0.9 }} // Click effect
          >
            {/* Rotating Icon */}
            <motion.div
              className="text-[var(--foreground)]"
              animate={{ rotate: theme === "light" ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {theme === "light" ? <Sun size={22} /> : <Moon size={22} />}
            </motion.div>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Change Theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
