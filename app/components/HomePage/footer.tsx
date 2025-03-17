"use client";
import { motion } from "framer-motion";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="py-10 px-5 md:px-20 shadow-lg"
      style={{ backgroundColor: "var(--background)" }} // Background color from CSS variables
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Section */}
        <div className="space-y-4">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-6 h-6 bg-[var(--warning)] rounded-sm"></div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              Finance Manager
            </h2>
          </motion.div>
          <p className="text-[var(--muted-foreground)]">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus eius earum facilis asperiores consectetur.
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-2 cursor-pointer rounded-lg shadow-md"
          >
            Start Live Chat
          </motion.button>
        </div>

        {/* Links Section */}
        {["Company", "Help", "Resources", "Extra Links"].map(
          (section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.8 }}
            >
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {section}
              </h3>
              <ul className="mt-3 space-y-2 text-[var(--muted-foreground)]">
                {section === "Company" &&
                  ["About", "Features", "Works", "Career"].map((item) => (
                    <motion.li key={item} whileHover={{ scale: 1.05, x: 5 }}>
                      <a href="#" className="hover:text-[var(--primary)]">
                        {item}
                      </a>
                    </motion.li>
                  ))}
                {section === "Help" &&
                  [
                    "Customer Support",
                    "Delivery Details",
                    "Terms & Conditions",
                    "Privacy Policy",
                  ].map((item) => (
                    <motion.li key={item} whileHover={{ scale: 1.05, x: 5 }}>
                      <a href="#" className="hover:text-[var(--primary)]">
                        {item}
                      </a>
                    </motion.li>
                  ))}
                {section === "Resources" &&
                  [
                    "Free eBooks",
                    "Development Tutorial",
                    "How to - Blog",
                    "YouTube Playlist",
                  ].map((item) => (
                    <motion.li key={item} whileHover={{ scale: 1.05, x: 5 }}>
                      <a href="#" className="hover:text-[var(--primary)]">
                        {item}
                      </a>
                    </motion.li>
                  ))}
                {section === "Extra Links" &&
                  [
                    "Customer Support",
                    "Delivery Details",
                    "Terms & Conditions",
                    "Privacy Policy",
                  ].map((item) => (
                    <motion.li key={item} whileHover={{ scale: 1.05, x: 5 }}>
                      <a href="#" className="hover:text-[var(--primary)]">
                        {item}
                      </a>
                    </motion.li>
                  ))}
              </ul>
            </motion.div>
          ),
        )}
      </div>

      {/* Bottom Section */}
      <div className="mt-10 flex flex-col items-center">
        <p className="text-[var(--muted-foreground)]">
          © Copyright 2021, All Rights Reserved by Postcraft
        </p>
        <motion.div
          className="flex space-x-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[FaTwitter, FaFacebookF, FaInstagram, FaGithub].map(
            (Icon, index) => (
              <motion.a
                key={index}
                whileHover={{ scale: 1.3, rotate: 10 }}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-xl"
                href="#"
              >
                <Icon />
              </motion.a>
            ),
          )}
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
