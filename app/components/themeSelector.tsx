"use client";

import { useTheme } from "@/context/themeContext";
import { Sun, Moon, Palette } from "lucide-react"; // Palette icon for Grey Mode

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded flex items-center gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] transition-colors duration-300"
    >
      {theme === "dark" ? <Sun size={18} /> : theme === "grey" ? <Palette size={18} /> : <Moon size={18} />}
      {theme === "dark" ? "Grey Mode" : theme === "grey" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
