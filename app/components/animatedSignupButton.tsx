"use client"
import { motion } from "framer-motion";
import { SignInButton } from "@clerk/nextjs";

const AnimatedSignInButton = () => {
  return (
    <SignInButton>
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "#4b5563" }} // Smooth hover effect
        whileTap={{ scale: 0.95 }} // Click effect
        initial={{ opacity: 0, y: -10 }} // Initial fade-in animation
        animate={{ opacity: 1, y: 0 }} // Smooth entry animation
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-gray-800 text-white font-bold py-2 px-4 rounded-md shadow-md transition-all"
      >
        Sign In
      </motion.button>
    </SignInButton>
  );
};

export default AnimatedSignInButton;
