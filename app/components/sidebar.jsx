"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X, User, Landmark, CircleDollarSign } from "lucide-react";
import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./themeSelector";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex bg-[var(--background)]">
      {/* Sidebar */}
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
          {menuItems.map((item) =>
            item.name === "Login/Signup" ? (
              <SignedOut key={item.name}>
                <SignInButton mode="modal">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 p-3 rounded-md cursor-pointer transition bg-[var(--button-secondary)] hover:bg-[var(--button-secondary-hover)]"
                  >
                    <item.icon size={20} />
                    {isOpen && <span className="text-sm">{item.name}</span>}
                  </motion.div>
                </SignInButton>
              </SignedOut>
            ) : (
              <Link key={item.name} href={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-3  ${
                    isOpen ? "justify-start pl-2 h-10" : "justify-center h-10"
                  } rounded-md cursor-pointer transition bg-[var(--button-secondary)] hover:bg-[var(--button-secondary-hover)]`}
                >
                  <item.icon size={20} />
                  {isOpen && <span className="text-sm">{item.name}</span>}
                </motion.div>
              </Link>
            )
          )}
        </nav>

        {/* User Button at the Bottom */}
        <SignedIn>
          <div className="mt-auto flex flex-row justify-between  p-3 border-t border-[var(--border)]">
            {<UserButton size="lg" className="ml-auto" />}
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
