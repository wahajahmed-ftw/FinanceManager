"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X, Home, Settings, User, LogIn, Database } from "lucide-react";
import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <motion.div
        initial={{ width: "4rem" }}
        animate={{ width: isOpen ? "16rem" : "4rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-screen bg-gray-900 text-white shadow-lg flex flex-col p-4"
      >
        {/* Sidebar Toggle Button */}
        <button
          className="text-white mb-6 p-2 hover:bg-gray-800 rounded-md transition"
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
                    className="flex items-center gap-3 p-3 rounded-md cursor-pointer transition bg-gray-800 hover:bg-gray-700"
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
                  className="flex items-center gap-3 p-3 rounded-md cursor-pointer transition bg-gray-800 hover:bg-gray-700"
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
          <div className="mt-auto flex flex-col items-center justify-center p-3 border-t border-gray-700">
            <UserButton showName />
          </div>
        </SignedIn>
      </motion.div>
    </div>
  );
};

// Sidebar Menu Items with Links
const menuItems = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Dashboard", icon: User, path: "/dashboard" },
  { name: "Income", icon: User, path: "/dashboard/income" },
  { name: "Expenses", icon: User, path: "/dashboard/expenses" },
  { name: "Fetch Data", icon: Database, path: "/fetchData" },
  { name: "Login/Signup", icon: LogIn },
];

export default Sidebar;
