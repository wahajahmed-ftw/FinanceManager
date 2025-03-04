"use client";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ExpenseBarChart from "./ExpenseBarChart";
import ExpensePieChart from "./ExpensePieChart";

export default function DashboardComponent() {
  const [data, setData] = useState({ totalIncome: 0, totalRemaining: 0, expensesByCategory: {} });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/dashboardinfo");
      const json = await res.json();
      if (json.success) setData(json.data);
    }
    fetchData();
  }, []);

  return (
    <div className="w-full h-screen relative">
      {/* Floating UI for Income & Remaining */}
      <div className="absolute top-4 left-4 text-white bg-gray-800 p-3 rounded-lg shadow-md">
        <h2 className="text-lg font-bold">Total Remaining: ${data.totalRemaining}</h2>
      </div>
      <div className="absolute top-4 right-4 text-white bg-gray-800 p-3 rounded-lg shadow-md">
        <h2 className="text-lg font-bold">Total Income: ${data.totalIncome}</h2>
      </div>

      {/* 3D Chart Canvas */}
      <Canvas camera={{ position: [0, 5, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ExpenseBarChart data={data.expensesByCategory} />
        <ExpensePieChart data={data.expensesByCategory} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
