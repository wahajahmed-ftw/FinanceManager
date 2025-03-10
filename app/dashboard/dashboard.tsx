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
  LineChart,
  Line,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Wallet, ShoppingCart, Car, Zap } from "lucide-react";
import SyncLoader from "react-spinners/SyncLoader";
import { Button } from "@/components/ui/button";

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
    color: "#ff3021",
    subcategories: ["Groceries", "Restaurants", "Fast Food"],
  },
  Transport: {
    name: "Transport",
    icon: Car,
    color: "#21c4ff",
    subcategories: ["Fuel", "Public Transport", "Taxi"],
  },
  Utilities: {
    name: "Utilities",
    icon: Zap,
    color: "#72ff21",
    subcategories: ["Electricity", "Water", "Internet"],
  },
};
const categories = Object.keys(CATEGORIES);

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
      } catch (error: unknown) {
        setError((error as Error).message);
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
      <div className="min-h-screen w-full flex items-center justify-center br-[var(--background)] text-[var(--foreground)]">
        <SyncLoader color="var(--foreground)" size={15} />
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="min-h-screen w-full flex items-center justify-center br-[var(--background)] text-[var(--foreground)]">
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
    <div className="min-h-screen w-full p-4 md:p-6 transition-colors duration-300 bg-gradient-to-br from-[var(--muted)] via-[var(--color-bg-middle)] to-[var(--color-bg-end)] text-[var(--color-text)]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full mx-auto"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold text-center mb-8 tracking-tight"
        >
          Financial Dashboard
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl shadow-2xl backdrop-blur-md bg-[var(--card-bg)] text-[var(--success)]"
          >
            <div className="flex items-center">
              <Wallet className="mr-4 h-10 w-10" />
              <div>
                <p className="text-sm opacity-75">Total Income</p>
                <p className="text-3xl font-bold">
                  ${data.totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl shadow-2xl backdrop-blur-md bg-[var(--card-bg)] text-[var(--foreground)]"
          >
            <div className="flex items-center">
              <Wallet className="mr-4 h-10 w-10" />
              <div>
                <p className="text-sm opacity-75">Remaining Balance</p>
                <p className="text-3xl font-bold">
                  ${data.totalRemaining.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl shadow-2xl backdrop-blur-md bg-[var(--card-bg)] text-[var(--foreground)]"
          >
            <div className="flex items-center">
              <ShoppingCart className="mr-4 h-10 w-10" />
              <div>
                <p className="text-sm opacity-75">Total Expenses</p>
                <p className="text-3xl font-bold">
                  ${(data.totalIncome - data.totalRemaining).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-8 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl shadow-2xl backdrop-blur-md bg-[var(--card-bg)]"
          >
            <h2 className="text-2xl font-semibold text-center mb-6">
              Expenses by Category
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl shadow-2xl backdrop-blur-md bg-[var(--card-bg)]"
          >
            <h2 className="text-2xl font-semibold text-center mb-6">
              Category Breakdown
            </h2>
            {/* <motion.select
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-full p-4 rounded-lg border-2 transition-all duration-300 bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] text-lg mb-6"
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
            </motion.select> */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-[var(--muted)] border-[var(--border)] text-[var(--foreground)] text-lg p-4 rounded-lg"
                  >
                    {selectedCategory
                      ? CATEGORIES[selectedCategory].name
                      : "Choose a Category"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[var(--radix-popper-anchor-width)] text-[var(--foreground)] bg-[var(--muted)] border-[var(--border)]"
                >
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="w-full"
                    >
                      {CATEGORIES[category].name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
            <AnimatePresence>
              {selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subcategoryData}>
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "var(--foreground)", fontSize: 14 }}
                      />
                      <YAxis
                        tick={{ fill: "var(--foreground)", fontSize: 14 }}
                      />
                      <Tooltip />
                      <Legend />
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

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-2xl shadow-2xl backdrop-blur-md bg-[var(--card-bg)] mb-8"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            Expense Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={categoryData}>
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--foreground)", fontSize: 14 }}
              />
              <YAxis tick={{ fill: "var(--foreground)", fontSize: 14 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Amount"
                stroke="var(--primary)" // Default line color
                strokeWidth={2}
                dot={{ r: 5 }} // Customizes data points
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </div>
  );
}
