"use client";

import { useState } from "react";
import { addIncome } from "./server"; // Import the server action

export default function IncomeForm() {
  const [incomeData, setIncomeData] = useState({
    source: "Job",
    date: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const result = await addIncome(formData); // Call server action

    if (result.success) {
      setMessage("Income added successfully!");
      setIncomeData({ source: "Job", date: "", amount: "" });
    } else {
      setMessage(result.error || "Error adding income.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add Income</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Source Dropdown */}
        <div>
          <label className="block font-semibold">Income Source</label>
          <select name="source" value={incomeData.source} onChange={handleChange} className="w-full p-2 border rounded-md">
            <option value="Job">Job</option>
            <option value="Side Hustle">Side Hustle</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        {/* Date Input */}
        <div>
          <label className="block font-semibold">Date</label>
          <input type="date" name="date" value={incomeData.date} onChange={handleChange} className="w-full p-2 border rounded-md" required />
        </div>

        {/* Amount Input */}
        <div>
          <label className="block font-semibold">Amount ($)</label>
          <input type="number" name="amount" value={incomeData.amount} onChange={handleChange} className="w-full p-2 border rounded-md" required />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700" disabled={loading}>
          {loading ? "Adding..." : "Add Income"}
        </button>

        {/* Success/Error Message */}
        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
