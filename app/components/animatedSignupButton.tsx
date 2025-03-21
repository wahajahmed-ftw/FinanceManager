"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignIn } from "@clerk/nextjs";
import { X } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";

const AnimatedSignInButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
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
        className="inline-flex items-center cursor-pointer justify-center px-3 sm:px-5 py-2.5 text-sm sm:text-base font-semibold transition-all duration-300 text-[var(--foreground)] bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] focus:bg-[var(--button-primary-hover)] rounded-lg hover:scale-105 hover:shadow-lg"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 25px -5px var(--ring)",
        }}
        role="button"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm"
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
              className="relative w-[90%] max-w-4xl h-[80vh] bg-[var(--card-bg)] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              ref={modalRef}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer transition-colors"
              >
                <X size={24} />
              </button>

              {/* Sign-In Form - Takes Full Width on Small Screens */}
              <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
                <div className="w-full max-w-lg">
                  <SignIn />
                </div>
              </div>

              {/* Right Side: Branding (Hidden on Small Screens) */}
              <div className="hidden lg:flex w-1/2 bg-[var(--primary)] relative items-center justify-center">
                <div className="absolute top-8 left-8 text-3xl font-bold text-[var(--primary-foreground)]">
                  Finance Manager
                </div>
                <div className="text-center">
                  <h1 className="text-5xl font-bold text-[var(--primary-foreground)] mb-4">
                    MANAGE YOUR <br /> FINANCES
                  </h1>
                  <p className="text-xl text-[var(--primary-foreground)]">
                    TAKE CONTROL OF YOUR EXPENSES
                  </p>
                </div>
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
