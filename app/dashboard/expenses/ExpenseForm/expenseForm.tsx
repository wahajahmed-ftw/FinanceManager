"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, DollarSign, Calendar, Layers, Tag } from "lucide-react";
import { addExpense } from "../server";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function ExpenseFormPopup({
  setDirty,
}: {
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    subcategory: "Groceries",
    date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);

  const categories: Record<string, string[]> = {
    Food: ["Groceries", "Restaurants", "Fast Food"],
    Transport: ["Fuel", "Public Transport", "Taxi"],
    Utilities: ["Electricity", "Water", "Internet"],
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setDirty(true)
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("amount", formData.amount);
    data.append("category", formData.category);
    data.append("subcategory", formData.subcategory);
    data.append("date", formData.date);

    try {
      const result = await addExpense(data);

      if (result.success) {
        setFormData({
          amount: "",
          category: "Food",
          subcategory: "Groceries",
          date: new Date().toISOString().split("T")[0],
        });

        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      } else {
      }
    } catch (_error) {
      console.error("Error adding expense:", _error);
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
              transition-colors cursor-pointer z-50"
            >
              <Plus size={32} />
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
bg-[var(--foreground)]/30 backdrop-blur-sm"
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
  relative border border-[var(--border)]/10"
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
                Add Expense
              </h2>

              {/* Expense Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount Input */}
                <div className="relative">
                  <label className="block mb-2 text-[var(--foreground)] flex items-center gap-2 font-bold ">
                    <DollarSign size={16} className="text-[var(--primary)]" />
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
          bg-[var(--background)]/70 text-[var(--foreground)] 
          border-[var(--border)] focus:ring-2 focus:ring-[var(--danger)] 
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

                {/* Date Input */}
                <div className="relative">
                  <label className="block mb-2 text-[var(--foreground)] flex items-center gap-2 font-bold">
                    <Calendar size={16} className="text-[var(--primary)]" />
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
          bg-[var(--background)]/70 text-[var(--foreground)] 
          border-[var(--border)] focus:ring-2 focus:ring-[var(--danger)] 
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

                {/* Category Dropdown */}
                <div className="relative">
                  <label className="block mb-2 text-[var(--foreground)] flex items-center gap-2 font-bold">
                    <Layers size={16} className="text-[var(--primary)]" />
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
          bg-[var(--background)]/70 text-[var(--foreground)] 
          border-[var(--border)] focus:ring-2 focus:ring-[var(--danger)] 
          transition-all"
                    >
                      {Object.keys(categories).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
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

                {/* Subcategory Dropdown */}
                <div className="relative">
                  <label className="block mb-2 text-[var(--foreground)] flex items-center gap-2 font-bold">
                    <Tag size={16} className="text-[var(--primary)]" />
                    Subcategory
                  </label>
                  <div className="relative">
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      className="w-full p-3 pr-10 border rounded-lg 
          bg-[var(--background)]/70 text-[var(--foreground)] 
          border-[var(--border)] focus:ring-2 focus:ring-[var(--danger)] 
          transition-all"
                    >
                      {categories[formData.category].map((subcat) => (
                        <option key={subcat} value={subcat}>
                          {subcat}
                        </option>
                      ))}
                    </select>
                    <div
                      className="pointer-events-none absolute 
        inset-y-0 right-0 flex items-center px-3 
        text-[var(--muted-foreground)]"
                    >
                      <Tag size={20} />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="w-full p-3 rounded-lg bg-[var(--primary)] 
      text-[var(--primary-foreground)] font-semibold 
      hover:bg-[var(--button-primary-hover)] focus:outline-none 
      focus:ring-2 focus:ring-[var(--button-primary-hover)] 
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
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
