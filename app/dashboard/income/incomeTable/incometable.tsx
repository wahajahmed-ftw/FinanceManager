"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import {
  X,
  DollarSign,
  Calendar,
  Layers,
  SquarePen,
  Trash2,
} from "lucide-react";
import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";

// Import AG Grid styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import Swal from "sweetalert2";
import SyncLoader from "react-spinners/SyncLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Register modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface Income {
  id: number;
  source: string;
  date: string;
  amount: number;
}

export default function IncomeTable({
  dirty,
  setDirty,
}: {
  dirty: boolean;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [incomeData, setIncomeData] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    fetchIncome(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, dirty]);

  const fetchIncome = async (month: number, year: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/income?month=${month}&year=${year}`);
      if (!res.ok) throw new Error("Failed to fetch income data");

      const data = await res.json();
      setIncomeData(
        data.map((income: Income) => ({
          ...income,
          date: new Date(income.date).toLocaleDateString(),
        }))
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setDirty(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This income entry will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--button-danger)",
      cancelButtonColor: "var(--button-secondary)",
      confirmButtonText: "Yes, delete it!",
      background: "var(--color-bg-middle)",
      color: "var(--foreground)",
      backdrop: "rgba(0, 0, 0, 0.7)",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(`/api/income/${id}`, { method: "DELETE" });
        const data = await response.json();

        if (data.success) {
          setIncomeData(incomeData.filter((income) => income.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Income entry has been removed.",
            icon: "success",
            background: "var(--color-bg-middle)",
            color: "var(--foreground)",
            backdrop: "rgba(0, 0, 0, 0.7)",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: data.error || "Failed to delete.",
            icon: "error",
            background: "var(--color-bg-middle)",
            color: "var(--foreground)",
            backdrop: "rgba(0, 0, 0, 0.7)",
          });
        }
      } catch {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong.",
          icon: "error",
          background: "var(--color-bg-middle)",
          color: "var(--foreground)",
          backdrop: "rgba(0, 0, 0, 0.7)",
        });
      }
    }
  };

  const openEditDialog = (income: Income) => {
    setEditingIncome(income);
    setIsOpen(true);
  };

  const handleEdit = async () => {
    if (!editingIncome) return;

    try {
      const res = await fetch(`/api/income/${editingIncome.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: editingIncome.source,
          amount: editingIncome.amount,
          date: editingIncome.date,
        }),
      });

      if (!res.ok) throw new Error("Failed to update income entry");

      fetchIncome(selectedMonth, selectedYear);
      setIsOpen(false);
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: (err as Error).message,
        icon: "error",
        background: "rgb(31, 41, 55)",
        color: "white",
        backdrop: "rgba(0,0,0,0.7)",
      });
    }
  };

  const columnDefs: ColDef<Income>[] = [
    {
      field: "source",
      headerName: "Income Source",
      sortable: true,
      filter: true,
      resizable: true,
    },
    {
      field: "date",
      headerName: "Date",
      sortable: true,
      filter: "agDateColumnFilter",
      resizable: true,
    },
    {
      field: "amount",
      headerName: "Amount ($)",
      sortable: true,
      filter: true,
      resizable: true,
      valueFormatter: (params) => `$${params.value.toLocaleString()}`,
    },
    {
      headerName: "Actions",
      cellRenderer: (params: { data: Income }) => (
        <div className="flex gap-2 items-center justify-center h-full">
          <motion.button
            onClick={() => openEditDialog(params.data)}
            className="bg-[var(--button-edit)] text-white px-3  h-9  rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 animate-float px-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SquarePen size={16} />
          </motion.button>
          <motion.button
            onClick={() => handleDelete(params.data.id)}
            className="bg-[var(--button-delete)] text-white px-3 h-9 rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 animate-float"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      ),
    },
  ];

  if (loading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center h-screen bg-[var(--background)]"
      >
        <SyncLoader color="var(--foreground)" size={15} />
      </motion.div>
    );

  if (error)
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-red-500 text-xl bg-gray-900 min-h-screen flex items-center justify-center"
      >
        {error}
      </motion.p>
    );

  if (incomeData.length === 0)
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-[var(--foreground)] text-xl bg-[var(--background)] min-h-screen flex items-center justify-center"
      >
        No income records found.
      </motion.p>
    );

  return (
    <div>
      <div className="flex center mt-13 justify-center gap-10 text-[var(--foreground)]">
        {/* Month Selector */}
        <Select
          onValueChange={(value) => setSelectedMonth(Number(value))}
          value={String(selectedMonth)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent className="text-[var(--foreground)] bg-[var(--background)]">
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Selector */}
        <Select
          onValueChange={(value) => setSelectedYear(Number(value))}
          value={String(selectedYear)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent className="text-[var(--foreground)] bg-[var(--background)]">
            {Array.from({ length: 5 }, (_, i) => (
              <SelectItem key={i} value={String(new Date().getFullYear() - i)}>
                {new Date().getFullYear() - i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4"
      >
        <div className="w-full max-w-6xl bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
          <div
            className="ag-theme-alpine-dark bg-gray-900"
            style={{ height: "500px", width: "100%", margin: "0 auto" }}
          >
            <h2 className="text-2xl font-bold text-center text-[var(--foreground)] py-4 bg-[var(--color-bg-end)]/50 backdrop-blur-sm">
              Income Records
            </h2>

            <AgGridReact
              className="ag-theme-alpine-dark"
              rowData={incomeData}
              columnDefs={columnDefs}
              modules={[ClientSideRowModelModule]}
              rowModelType="clientSide"
              animateRows={true}
              rowHeight={50}
              pagination={true}
              defaultColDef={{
                flex: 1, // Makes columns expand evenly to fill the space
                minWidth: 100, // Prevents columns from becoming too small
                sortable: true,
                filter: true,
                resizable: true,
              }}
              gridOptions={{
                autoSizeStrategy: {
                  type: "fitGridWidth", // Ensures columns take up full width
                  defaultMinWidth: 100,
                },
              }}
            />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center 
              bg-[var(--overlay-bg)] backdrop-blur-sm"
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
                  Edit Income Entry
                </h2>

                {/* Income Form */}
                <form onSubmit={handleEdit} className="space-y-4">
                  {/* Income Source */}
                  <div className="relative">
                    <select
                      name="source"
                      value={editingIncome?.source || ""}
                      onChange={(e) =>
                        setEditingIncome({
                          ...editingIncome!,
                          source: e.target.value,
                        })
                      }
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

                  {/* Date Input */}
                  <div className="relative">
                    <label className="block mb-2 text-[var(--muted-foreground)] flex items-center gap-2">
                      <Calendar size={16} className="text-[var(--primary)]" />
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={
                          editingIncome?.date.split("/").reverse().join("-") ||
                          ""
                        }
                        max={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          setEditingIncome({
                            ...editingIncome!,
                            date: e.target.value,
                          })
                        }
                        required
                        className="w-full p-3 border rounded-lg 
                        bg-[var(--color-select-bg)]
                        text-[var(--foreground)]
                        border-[var(--border)] 
                        focus:ring-2 focus:ring-[var(--ring)] 
                        transition-all"
                      />
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="relative">
                    <label className="block mb-2 text-[var(--muted-foreground)] flex items-center gap-2">
                      <DollarSign size={16} className="text-[var(--primary)]" />
                      Amount ($)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={editingIncome?.amount || ""}
                        onChange={(e) =>
                          setEditingIncome({
                            ...editingIncome!,
                            amount: parseFloat(e.target.value),
                          })
                        }
                        min="0"
                        step="10"
                        required
                        placeholder="Enter amount"
                        className="w-full p-3 border rounded-lg 
                        bg-[var(--color-select-bg)]
                        text-[var(--foreground)]
                        border-[var(--border)] 
                        focus:ring-2 focus:ring-[var(--ring)] 
                        transition-all"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between mt-6 space-x-4">
                    <motion.button
                      onClick={() => setIsOpen(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-[var(--button-secondary)] 
                      text-[var(--muted-foreground)] py-2 rounded-lg 
                      hover:bg-[var(--button-secondary-hover)] transition duration-300"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleEdit}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-[var(--button-primary)] 
                      text-[var(--primary-foreground)] py-2 rounded-lg 
                      hover:bg-[var(--button-primary-hover)] transition duration-300"
                    >
                      Save
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
