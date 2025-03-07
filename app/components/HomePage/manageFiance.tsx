"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const moneyyyLottie = "/images/moneyyy.json";

const LandingSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[80vh] p-10"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto items-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -100 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
            <DotLottieReact src={moneyyyLottie} loop autoplay />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-left"
          style={{ color: "var(--foreground)" }}
        >
          <h1 className="text-4xl font-bold leading-tight">
            Take Control of Your Daily Expenses
          </h1>
          <p className="mt-4">
            Managing your money has never been easier! Our smart A.I. analyzes
            your past expenses and helps you predict future spending patterns.
            Stay ahead of your finances and make informed decisions
            effortlessly.
          </p>
          <p className="mt-4">
            Get personalized insights, set financial goals, and take control of
            your savings. Whether it's budgeting for groceries or planning for
            big investments, our intelligent system guides you every step of the
            way.
          </p>
          <p className="mt-4">
            Start optimizing your financial habits today and make the most of
            every dollar!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingSection;
