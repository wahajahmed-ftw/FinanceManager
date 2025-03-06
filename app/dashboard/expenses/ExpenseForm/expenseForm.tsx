"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, DollarSign, Calendar, Layers } from "lucide-react";
import { addExpense } from "../server";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
export default function ExpenseFormPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    subcategory: "Groceries",
    date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const categories: Record<string, string[]> = {
    Food: ["Groceries", "Restaurants", "Fast Food"],
    Transport: ["Fuel", "Public Transport", "Taxi"],
    Utilities: ["Electricity", "Water", "Internet"],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = new FormData();
    data.append("amount", formData.amount);
    data.append("category", formData.category);
    data.append("subcategory", formData.subcategory);
    data.append("date", formData.date);

    try {
      const result = await addExpense(data);

      if (result.success) {
        setMessage("Expense added successfully!");
        setFormData({
          amount: "",
          category: "Food",
          subcategory: "Groceries",
          date: new Date().toISOString().split("T")[0],
        });
        
        setTimeout(() => {
          setIsOpen(false);
          setMessage("");
        }, 2000);
      } else {
        setMessage(result.error || "Error adding expense.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
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
                  className="fixed bottom-6 right-6 bg-red-600 text-white 
                  w-16 h-16 rounded-full flex items-center justify-center 
                  shadow-2xl hover:bg-red-700 transition-colors 
                  dark:bg-red-500 dark:hover:bg-red-600"
                  >
                  <Plus size={32}  />
                </motion.button>
              </TooltipTrigger>
            <TooltipContent>Add Expense</TooltipContent>
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
                damping: 20 
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 
                backdrop-blur-lg rounded-2xl shadow-2xl p-6 
                relative border border-white/10"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-600 
                  dark:text-gray-300 hover:text-gray-900 
                  dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Form Title */}
              <h2 className="text-2xl font-bold mb-6 text-center 
                text-gray-800 dark:text-white flex items-center 
                justify-center gap-2">
                <DollarSign className="text-red-600" />
                Add Expense
              </h2>

              {/* Expense Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount Input */}
                <div className="relative">
                  <label className="block mb-2 text-gray-700 
                    dark:text-gray-300 flex items-center gap-2">
                    <DollarSign size={16} className="text-red-600" />
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      placeholder="Enter amount"
                      className="w-full p-3 pl-10 border rounded-lg 
                        bg-white/70 dark:bg-gray-700/70 
                        text-gray-800 dark:text-white 
                        border-gray-300 dark:border-gray-600 
                        focus:ring-2 focus:ring-red-500 
                        transition-all"
                    />
                    <div className="pointer-events-none absolute 
                      inset-y-0 left-0 flex items-center px-3 
                      text-gray-500">
                      <DollarSign size={20} />
                    </div>
                  </div>
                </div>

                {/* Date Input */}
                <div className="relative">
                  <label className="block mb-2 text-gray-700 
                    dark:text-gray-300 flex items-center gap-2">
                    <Calendar size={16} className="text-red-600" />
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full p-3 pr-10 border rounded-lg 
                        bg-white/70 dark:bg-gray-700/70 
                        text-gray-800 dark:text-white 
                        border-gray-300 dark:border-gray-600 
                        focus:ring-2 focus:ring-red-500 
                        transition-all"
                    />
                    <div className="pointer-events-none absolute 
                      inset-y-0 right-0 flex items-center px-3 
                      text-gray-500">
                      <Calendar size={20} />
                    </div>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <label className="block mb-2 text-gray-700 
                    dark:text-gray-300 flex items-center gap-2">
                    <Layers size={16} className="text-red-600" />
                    Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          category: e.target.value,
                          subcategory: categories[e.target.value][0],
                        });
                      }}
                      className="w-full p-3 pr-10 border rounded-lg 
                        bg-white/70 dark:bg-gray-700/70 
                        text-gray-800 dark:text-white 
                        border-gray-300 dark:border-gray-600 
                        focus:ring-2 focus:ring-red-500 
                        transition-all"
                    >
                      {Object.keys(categories).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute 
                      inset-y-0 right-0 flex items-center px-3 
                      text-gray-500">
                      <Layers size={20} />
                    </div>
                  </div>
                </div>

                {/* Subcategory Dropdown */}
                <div className="relative">
                  <label className="block mb-2 text-gray-700 
                    dark:text-gray-300 flex items-center gap-2">
                    <Layers size={16} className="text-red-600" />
                    Subcategory
                  </label>
                  <div className="relative">
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      className="w-full p-3 pr-10 border rounded-lg 
                        bg-white/70 dark:bg-gray-700/70 
                        text-gray-800 dark:text-white 
                        border-gray-300 dark:border-gray-600 
                        focus:ring-2 focus:ring-red-500 
                        transition-all"
                    >
                      {(categories[formData.category as keyof typeof categories] || []).map((subcat) => (
                        <option key={subcat} value={subcat}>
                          {subcat}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute 
                      inset-y-0 right-0 flex items-center px-3 
                      text-gray-500">
                      <Layers size={20} />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-red-600 
                    text-white font-semibold 
                    hover:bg-red-700 focus:outline-none 
                    focus:ring-2 focus:ring-red-500 
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
                    "Add Expense"
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
                          ? "text-green-600" 
                          : "text-red-600"
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