"use client";

import { useState } from "react";
import { addExpense } from "../server";

export default function ExpenseForm() {
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    subcategory: "Groceries",
    date: new Date().toISOString().split("T")[0], // Default to today's date
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
    data.append("date", formData.date); // Add date field

    const response = await addExpense(data);
    setLoading(false);

    if (response.success) {
      setMessage("Expense added successfully!");
      setFormData({
        amount: "",
        category: "Food",
        subcategory: "Groceries",
        date: new Date().toISOString().split("T")[0], // Reset to today's date
      });
    } else {
      setMessage("Error: " + response.error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg bg-gray-800 text-white">
      <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
      {message && <p className="text-green-400 mb-3">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Amount Input */}
        <div>
          <label className="block font-semibold text-gray-200">Amount ($)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-gray-700 text-white"
            required
          />
        </div>

        {/* Date Input */}
        <div>
          <label className="block font-semibold text-gray-200">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-gray-700 text-white"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block font-semibold text-gray-200">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => {
              setFormData({
                ...formData,
                category: e.target.value,
                subcategory: categories[e.target.value][0], // Reset subcategory on category change
              });
            }}
            className="w-full p-2 border rounded-md bg-gray-700 text-white"
          >
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Dropdown */}
        <div>
          <label className="block font-semibold text-gray-200">Subcategory</label>
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-gray-700 text-white"
          >
            {(categories[formData.category as keyof typeof categories] || []).map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
}
