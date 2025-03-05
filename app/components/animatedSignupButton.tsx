"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignIn } from "@clerk/nextjs";
import { X } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { MagicCard } from "@/components/magicui/magic-card";
const AnimatedSignInButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>  
      {/* Animated Sign-In Button */}
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "#4b5563" }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-gray-800 text-white font-bold py-2 px-4 rounded-md shadow-md transition-all"
        onClick={() => setIsOpen(true)}
      >
        Sign In
      </motion.button>

      {/* Animated Modal */}
      <AnimatePresence>
        {isOpen && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[90%] max-w-4xl h-[80vh] bg-gradient-to-br from-[#111] to-[#222] rounded-2xl overflow-hidden shadow-2xl flex"
              ref={modalRef}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Left Side: Sign-In Form */}
              <div className="w-1/2 p-8 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <SignIn
                    appearance={{
                      layout: {
                        socialButtonsPlacement: "top",
                        socialButtonsVariant: "iconButton",
                      },
                      elements: {
                        rootBox: "w-full",
                        card: "bg-transparent shadow-none",
                        headerTitle: "text-3xl font-bold text-lime-400 mb-4",
                        headerSubtitle: "text-gray-400 mb-6",
                        socialButtons: "w-full mb-4",
                        socialButtonsBlockButton: "bg-gray-800 text-white hover:bg-gray-700",
                        divider: "before:border-gray-700 after:border-gray-700 text-gray-500",
                        formFieldInput:
                          "bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-lime-400",
                        formFieldLabel: "text-gray-400",
                        formButtonPrimary:
                          "bg-lime-400 text-black hover:bg-lime-300 w-full py-3 rounded-lg",
                        footerActionText: "text-gray-400",
                        footerActionLink: "text-lime-400 hover:text-lime-300",
                      },
                      variables: {
                        colorPrimary: "#a4ff00",
                      },
                    }}
                  />
                </div>
              </div>

              {/* Right Side: Branding */}
              <div className="w-1/2 bg-[#6A5ACD] relative flex items-center justify-center">
                <div className="absolute top-8 left-8 text-3xl font-bold text-black">Finance Manager</div>
                <div className="text-center">
                  <h1 className="text-5xl font-bold text-black mb-4">
                    MANAGE YOUR <br /> FINANCES
                  </h1>
                  <p className="text-xl text-black">TAKE CONTROL OF YOUR EXPENSES</p>
                </div>

                {/* Decorative Curved Lines */}
                <motion.svg
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 50 Q50 30, 100 50 T200 50"
                    fill="none"
                    stroke="#a4ff00"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </div>
            <BorderBeam duration={8} size={300} />
            </motion.div>
          </motion.div>

        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedSignInButton;
