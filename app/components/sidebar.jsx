"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X, User, Landmark, CircleDollarSign, SquarePen, Trash2 } from "lucide-react";
import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./themeSelector";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Mobile topbar layout
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] text-[var(--foreground)] shadow-md">
        {/* Mobile Topbar */}
        <div className="flex items-center justify-between px-4 py-2">
          {/* Logo or brand name could go here */}
          <div className="flex items-center gap-2">
            <span className="font-bold">Finance Manager</span>
          </div>
          
          {/* Toggle menu button */}
          <button
            className="text-[var(--foreground)] p-2 rounded-md hover:bg-[var(--muted)]"
            onClick={toggleSidebar}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[var(--border)] px-4 py-2"
          >
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link key={item.name} href={item.path} onClick={toggleSidebar}>
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[var(--button-secondary-hover)]">
                    <item.icon size={18} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                </Link>
              ))}
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-[var(--border)]">
                <ThemeToggle />
                <SignedIn>
                  <UserButton size="sm" />
                </SignedIn>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    );
  }

  // Desktop sidebar layout
  return (
    <div className="flex bg-[var(--background)]">
      <motion.div
        initial={{ width: "4rem" }}
        animate={{ width: isOpen ? "16rem" : "4rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-screen bg-[var(--background)] text-[var(--foreground)] shadow-lg flex flex-col p-4"
      >
        {/* Sidebar Toggle Button */}
        <button
          className="text-[var(--foreground)] cursor-pointer mb-6 p-2 hover:bg-[var(--muted)] rounded-md transition"
          onClick={toggleSidebar}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar Items */}
        <nav className="flex flex-col gap-4 flex-grow">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.path} onClick={toggleSidebar}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-3 ${
                  isOpen ? "justify-start pl-2 h-10" : "justify-center h-10"
                } rounded-md cursor-pointer transition bg-[var(--button-secondary)] hover:bg-[var(--button-secondary-hover)]`}
              >
                <item.icon size={20} />
                {isOpen && <span className="text-sm">{item.name}</span>}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* User Button at the Bottom */}
        <SignedIn>
          <div className="mt-auto flex flex-row justify-between p-3 border-t border-[var(--border)]">
            <UserButton size="lg" className="ml-auto" />
            {isOpen && <ThemeToggle />}
          </div>
        </SignedIn>
      </motion.div>
    </div>
  );
};

// Sidebar Menu Items with Links
const menuItems = [
  { name: "Dashboard", icon: User, path: "/dashboard" },
  { name: "Income", icon: Landmark, path: "/dashboard/income" },
  { name: "Expenses", icon: CircleDollarSign, path: "/dashboard/expenses" },
];

export default Sidebar;