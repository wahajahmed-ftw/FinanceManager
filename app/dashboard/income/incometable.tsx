"use client";

import { useEffect, useState } from "react";

interface Income {
  id: number;
  source: string;
  date: string;
  amount: number;
}

export default function IncomeTable() {
  const [incomeData, setIncomeData] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const res = await fetch(`/api/income`); // No userId needed!
        if (!res.ok) throw new Error("Failed to fetch income data");

        const data = await res.json();
        setIncomeData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, []);

  if (loading) return <p className="text-center">Loading income data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (incomeData.length === 0) return <p className="text-center">No income records found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Income Records</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Source</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Amount ($)</th>
          </tr>
        </thead>
        <tbody>
          {incomeData.map((income) => (
            <tr key={income.id} className="text-center">
              <td className="border p-2">{income.source}</td>
              <td className="border p-2">{new Date(income.date).toLocaleDateString()}</td>
              <td className="border p-2 font-semibold">${income.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
