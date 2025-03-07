"use client";
import { motion } from "framer-motion";
import React from "react";
import AnimatedSignInButton from "../animatedSignupButton";
import { useInView } from "react-intersection-observer";
import ThemeToggle from "../themeSelector";

export function MainLanding() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const fromBottomVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const textPopVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Staggered children animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  // For logo reveal
  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="relative bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      <header className="absolute inset-x-0 top-0 z-10 w-full">
        <div className="px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <motion.div
              className="flex-shrink-0"
              initial="hidden"
              animate="visible"
              variants={logoVariants}
            >
              <a href="#" title="" className="flex">
                <img
                  className="w-auto h-8"
                  src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/5/logo.svg"
                  alt=""
                />
              </a>
            </motion.div>

            <motion.div
              className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {["Features", "Solutions", "Resources", "Pricing"].map(
                (item, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    title=""
                    className="text-base text-[var(--foreground)] transition-all duration-300 hover:text-opacity-80 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[var(--success)] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                    variants={textPopVariants}
                  >
                    {item}
                  </motion.a>
                ),
              )}
            </motion.div>

            <motion.div
              className="lg:flex lg:items-center lg:justify-end lg:space-x-6 sm:ml-auto"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <ThemeToggle />
              <AnimatedSignInButton />
            </motion.div>

            <motion.button
              type="button"
              className="inline-flex p-2 ml-1 text-[var(--foreground)] transition-all duration-200 rounded-md sm:ml-4 lg:hidden focus:bg-[var(--muted-foreground)] hover:bg-[var(--muted-foreground)]"
              variants={textPopVariants}
              initial="hidden"
              animate="visible"
              whileTap={{ scale: 0.95 }}
            >
              {/* <!-- Menu open: "hidden", Menu closed: "block" --> */}
              <svg
                className="block w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>

              {/* <!-- Menu open: "block", Menu closed: "hidden" --> */}
              <svg
                className="hidden w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </motion.button>
          </div>
        </div>
      </header>

      <section className="relative lg:min-h-[1000px] pt-24 pb-10 sm:pt-32 sm:pb-16 lg:pb-24">
        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 hidden lg:flex"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 1.0,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <img
            className="hidden w-full lg:block "
            src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/5/credit-cards.png"
            alt=""
          />
          {/* <img className="block w-full lg:hidden" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/5/credit-cards-mobile.png" alt="" /> */}
        </motion.div>

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
          <motion.div
            className="max-w-xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fromBottomVariants}
          >
            <motion.h1
              className="text-4xl font-bold sm:text-6xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--success)] to-[var(--foreground)]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: [0.8, 1.05, 1],
                  transition: {
                    duration: 0.8,
                    times: [0, 0.8, 1],
                    delay: 0.8,
                  },
                }}
              >
                Your Personal Finance Manager
              </motion.span>
            </motion.h1>

            <motion.p
              className="mt-5 text-base text-[var(--foreground)] sm:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              No more stress managing your expenses and savings. Use Postcrats
              Finance Manager to track your finances effortlessly and make
              smarter financial decisions.
            </motion.p>

            <motion.a
              href="#"
              title=""
              className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-[var(--primary-foreground)] transition-all duration-300 bg-[var(--primary)] rounded-lg sm:mt-16 hover:bg-[var(--button-primary-hover)] focus:bg-[var(--button-primary-hover)] hover:scale-105 hover:shadow-lg hover:shadow-[var(--primary)]/20"
              role="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(var(--primary), 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More
              <motion.svg
                className="w-6 h-6 ml-8 -mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </motion.svg>
            </motion.a>

            <motion.div
              className="grid grid-cols-1 px-20 mt-12 text-left gap-x-12 gap-y-8 sm:grid-cols-3 sm:px-0"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delayChildren: 1.5, staggerChildren: 0.2 }}
            >
              <motion.div
                className="flex items-center"
                variants={fromBottomVariants}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <motion.svg
                  className="flex-shrink-0"
                  width="31"
                  height="25"
                  viewBox="0 0 31 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <path
                    d="M25.1667 14.187H20.3333C17.6637 14.187 15.5 16.3507 15.5 19.0203V19.8258C15.5 19.8258 18.0174 20.6314 22.75 20.6314C27.4826 20.6314 30 19.8258 30 19.8258V19.0203C30 16.3507 27.8363 14.187 25.1667 14.187Z"
                    stroke="var(--success)"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.7227 6.9369C18.7227 4.71276 20.5263 2.90912 22.7504 2.90912C24.9746 2.90912 26.7782 4.71276 26.7782 6.9369C26.7782 9.16104 24.9746 11.7702 22.7504 11.7702C20.5263 11.7702 18.7227 9.16104 18.7227 6.9369Z"
                    stroke="var(--success)"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.2231 15.8512H7.11157C3.73595 15.8512 1 18.5871 1 21.9628V22.9814C1 22.9814 4.18311 24 10.1674 24C16.1516 24 19.3347 22.9814 19.3347 22.9814V21.9628C19.3347 18.5871 16.5988 15.8512 13.2231 15.8512Z"
                    fill="#0B1715"
                    stroke="var(--primary-foreground)"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.07422 6.68386C5.07422 3.87152 7.35485 1.59088 10.1672 1.59088C12.9795 1.59088 15.2602 3.87152 15.2602 6.68386C15.2602 9.4962 12.9795 12.7954 10.1672 12.7954C7.35485 12.7954 5.07422 9.4962 5.07422 6.68386Z"
                    fill="#0B1715"
                    stroke="var(--primary-foreground)"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
                <motion.p
                  className="ml-3 text-sm text-[var(--foreground)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Over 12,000 Users
                </motion.p>
              </motion.div>

              <motion.div
                className="flex items-center"
                variants={fromBottomVariants}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <motion.svg
                  className="flex-shrink-0"
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <path
                    d="M19.8335 21.9166H3.16683C2.6143 21.9166 2.08439 21.6972 1.69369 21.3065C1.30299 20.9158 1.0835 20.3858 1.0835 19.8333V3.16665C1.0835 2.61411 1.30299 2.08421 1.69369 1.69351C2.08439 1.30281 2.6143 1.08331 3.16683 1.08331H19.8335C20.386 1.08331 20.9159 1.30281 21.3066 1.69351C21.6973 2.08421 21.9168 2.61411 21.9168 3.16665V19.8333C21.9168 20.3858 21.6973 20.9158 21.3066 21.3065C20.9159 21.6972 20.386 21.9166 19.8335 21.9166Z"
                    stroke="var(--primary-foreground)"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <motion.path
                    d="M7 12.6667L9.25 15L16 8"
                    stroke="var(--success)"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="30"
                    strokeDashoffset="30"
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.5, delay: 1.8 }}
                  />
                </motion.svg>
                <motion.p
                  className="ml-3 text-sm text-[var(--foreground)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  No annual fees, Free of Cost
                </motion.p>
              </motion.div>

              <motion.div
                className="flex items-center"
                variants={fromBottomVariants}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <motion.svg
                  className="flex-shrink-0"
                  width="20"
                  height="24"
                  viewBox="0 0 20 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <path
                    d="M17 11H3C1.89543 11 1 11.8954 1 13V21C1 22.1046 1.89543 23 3 23H17C18.1046 23 19 22.1046 19 21V13C19 11.8954 18.1046 11 17 11Z"
                    stroke="var(--primary-foreground)"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <motion.path
                    d="M10 19C11.1046 19 12 18.1046 12 17C12 15.8954 11.1046 15 10 15C8.89543 15 8 15.8954 8 17C8 18.1046 8.89543 19 10 19Z"
                    stroke="var(--success)"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, rotate: [0, 360] }}
                    transition={{ duration: 1.5, delay: 1.8 }}
                  />
                  <path
                    d="M15 7V6C15.0131 4.68724 14.5042 3.42303 13.5853 2.48539C12.6664 1.54776 11.4128 1.01346 10.1 1H10C8.68724 0.986939 7.42303 1.4958 6.48539 2.41469C5.54776 3.33357 5.01346 4.58724 5 5.9V7"
                    stroke="var(--success)"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
                <motion.p
                  className="ml-3 text-sm text-[var(--foreground)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Secure & hassle-free online financial management
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
