"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Wallet, ShoppingCart, Car, Zap } from "lucide-react";

// Define strict types
interface FinanceData {
  totalIncome: number;
  totalRemaining: number;
  expensesByCategory: Record<string, number>;
  expensesBySubcategory: Record<string, number>;
}

interface CategoryDetails {
  name: string;
  icon: React.ComponentType;
  color: string;
  subcategories: string[];
}

interface ChartDataItem {
  name: string;
  value: number;
  color?: string;
}

// Predefined categories with icons and types
const CATEGORIES: Record<string, CategoryDetails> = {
  Food: {
    name: "Food",
    icon: ShoppingCart,
    // color: "#FF6B6B",
    color: "#ff3021",
    subcategories: ["Groceries", "Restaurants", "Fast Food"],
  },
  Transport: {
    name: "Transport",
    icon: Car,
    // color: "#4ECDC4",
    color: "#21c4ff",
    subcategories: ["Fuel", "Public Transport", "Taxi"],
  },
  Utilities: {
    name: "Utilities",
    icon: Zap,
    // color: "#45B7D1",
    color: "#72ff21",
    subcategories: ["Electricity", "Water", "Internet"],
  },
};

export default function FinanceDashboard() {
  // State management with explicit typing
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch finance data
  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const res = await fetch("/api/dashboardinfo");
        if (!res.ok) throw new Error("Failed to fetch financial data");

        const json = await res.json();
        setData(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  // Prepare category chart data
  const prepareCategoryData = (): ChartDataItem[] => {
    if (!data?.expensesByCategory) return [];

    return Object.keys(data.expensesByCategory).map((key) => ({
      name: key,
      value: data.expensesByCategory[key],
      color: CATEGORIES[key]?.color || "#8884d8",
    }));
  };

  // Prepare subcategory chart data
  const prepareSubcategoryData = (): ChartDataItem[] => {
    if (!selectedCategory || !data?.expensesBySubcategory) return [];

    return CATEGORIES[selectedCategory].subcategories.map((sub: string) => ({
      name: sub,
      value: data.expensesBySubcategory[sub] || 0,
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  // Loading state
  if (loading)
    return (
      <div
        className={`min-h-screen flex items-center justify-center br-[var(--background)] text-[var(--foreground)] `}
      >
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"
        ></motion.p>
      </div>
    );

  // Error state
  if (error)
    return (
      <div
        className={`min-h-screen flex items-center justify-center br-[var(--background)] text-[var(--foreground)]`}
      >
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold"
        >
          {error}
        </motion.p>
      </div>
    );

  // Ensure data is not null before rendering
  if (!data) return null;

  // Prepare chart data
  const categoryData = prepareCategoryData();
  const subcategoryData = prepareSubcategoryData();

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 bg-gradient-to-br from-[var(--muted)] via-[var(--color-bg-middle)] to-[var(--color-bg-end)] text-[var(--color-text)]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold text-center mb-8 tracking-tight"
        >
          Financial Dashboard
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="flex justify-between mb-8 space-x-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-1 p-6 rounded-2xl shadow-2xl backdrop-blur-md bg-[var(--card-bg)] text-[var(--success)]"
          >
            <div className="flex items-center">
              <Wallet className="mr-4" />
              <div>
                <p className="text-sm opacity-75">Total Income</p>
                <p className="text-2xl font-bold">
                  ${data.totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-1 p-6 rounded-2xl shadow-2xl backdrop-blur-md bg-[var(--card-bg)] text-[var(--foreground)]"
          >
            <div className="flex items-center">
              <Wallet className="mr-4" />
              <div>
                <p className="text-sm opacity-75">Remaining Balance</p>
                <p className="text-2xl font-bold">
                  ${data.totalRemaining.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-8"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="p-6 rounded-2xl shadow-2xl backdrop-blur-md bg-[var(--card-bg)]"
          >
            <h2 className="text-xl font-semibold text-center mb-4">
              Expenses by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 rounded-2xl shadow-2xl backdrop-blur-md bg-[var(--card-bg)]"
          >
            <h2 className="text-xl font-semibold text-center mb-4">
              Select Category
            </h2>
            <motion.select
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-full p-3 rounded-lg border-2 transition-all duration-300 bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)]"
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" disabled>
                Choose a Category
              </option>
              {Object.keys(CATEGORIES).map((category) => (
                <option key={category} value={category}>
                  {CATEGORIES[category].name}
                </option>
              ))}
            </motion.select>

            <AnimatePresence>
              {selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={subcategoryData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill={CATEGORIES[selectedCategory].color}
                        name="Expenses"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
