"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, DollarSign, Calendar, Layers } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addIncome } from "../server";

export default function IncomeFormPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [incomeData, setIncomeData] = useState({
    source: "Job",
    date: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setIncomeData({ ...incomeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("source", incomeData.source);
    formData.append("date", incomeData.date);
    formData.append("amount", incomeData.amount);

    try {
      const result = await addIncome(formData);

      if (result.success) {
        setMessage("Income added successfully!");
        setIncomeData({ source: "Job", date: "", amount: "" });

        // Optional: Close popup after successful submission
        setTimeout(() => {
          setIsOpen(false);
          setMessage("");
        }, 2000);
      } else {
        setMessage(result.error || "Error adding income.");
      }
    } catch (error) {
      const errMsg = (error as Error).message || "Error adding income.";
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Add Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 right-6 
              bg-[var(--primary)] text-var[(--primary-foreground)] 
              w-16 h-16 rounded-full flex items-center justify-center 
              shadow-2xl hover:bg-var[(--button-danger-hover)] 
              transition-colors cursor-pointer"
            >
              <Plus size={32} />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>Add Income</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Popup Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center 
              bg-black/30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            {/* Popup Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[var(--card-bg)]/80 
                backdrop-blur-lg rounded-2xl shadow-2xl p-6 
                relative border border-[var(--border)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-[var(--muted-foreground)] 
                  hover:text-[var(--foreground)] transition-colors"
              >
                <X size={24} />
              </button>

              {/* Form Title */}
              <h2
                className="text-2xl font-bold mb-6 text-center 
                text-[var(--foreground)] flex items-center 
                justify-center gap-2"
              >
                <DollarSign className="text-[var(--primary)]" />
                Add Income
              </h2>

              {/* Income Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Income Source */}
                <div className="relative">
                  <label className="block mb-2 text-[var(--muted-foreground)] flex items-center gap-2">
                    <Layers size={16} className="text-[var(--primary)]" />
                    Income Source
                  </label>
                  <div className="relative">
                    <select
                      name="source"
                      value={incomeData.source}
                      onChange={handleChange}
                      className="w-full p-3 pr-10 border rounded-lg 
                        bg-[var(--color-select-bg)] 
                        text-[var(--foreground)]
                        border-[var(--border)] 
                        focus:ring-2 focus:ring-[var(--ring)] 
                        transition-all"
                    >
                      <option value="Job">Job</option>
                      <option value="Side Hustle">Side Hustle</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investment">Investment</option>
                      <option value="Other">Other</option>
                    </select>
                    <div
                      className="pointer-events-none absolute 
                      inset-y-0 right-0 flex items-center px-3 
                      text-[var(--muted-foreground)]"
                    >
                      <Layers size={20} />
                    </div>
                  </div>
                </div>

                {/* Date Input */}
                <div className="relative">
                  <label className="block mb-2 text-[var(--muted-foreground)] flex items-center gap-2">
                    <Calendar size={16} className="text-[var(--primary)]" />
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={incomeData.date}
                      onChange={handleChange}
                      required
                      className="w-full p-3 pr-10 border rounded-lg 
                        bg-[var(--color-select-bg)]
                        text-[var(--foreground)]
                        border-[var(--border)] 
                        focus:ring-2 focus:ring-[var(--ring)] 
                        transition-all"
                    />
                    <div
                      className="pointer-events-none absolute 
                      inset-y-0 right-0 flex items-center px-3 
                      text-[var(--muted-foreground)]"
                    >
                      <Calendar size={20} />
                    </div>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="relative">
                  <label className="block mb-2 text-[var(--muted-foreground)] flex items-center gap-2">
                    <DollarSign size={16} className="text-[var(--primary)]" />
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="amount"
                      value={incomeData.amount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      placeholder="Enter amount"
                      className="w-full p-3 pl-10 border rounded-lg 
                        bg-[var(--color-select-bg)]
                        text-[var(--foreground)]
                        border-[var(--border)] 
                        focus:ring-2 focus:ring-[var(--ring)] 
                        transition-all"
                    />
                    <div
                      className="pointer-events-none absolute 
                      inset-y-0 left-0 flex items-center px-3 
                      text-[var(--muted-foreground)]"
                    >
                      <DollarSign size={20} />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-[var(--button-primary)] 
                    text-[var(--primary-foreground)] font-semibold 
                    hover:bg-[var(--button-primary-hover)] focus:outline-none 
                    focus:ring-2 focus:ring-[var(--ring)] 
                    focus:ring-offset-2 transition-all 
                    disabled:opacity-50 disabled:cursor-not-allowed 
                    flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">◌</span>
                      Adding...
                    </>
                  ) : (
                    "Add Income"
                  )}
                </motion.button>

                {/* Message Display */}
                <AnimatePresence>
                  {message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`text-center mt-2 ${
                        message.includes("successfully")
                          ? "text-[var(--success)]"
                          : "text-[var(--danger)]"
                      }`}
                    >
                      {message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
