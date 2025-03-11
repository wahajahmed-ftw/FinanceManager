"use client";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ColDef,
  ModuleRegistry,
  ClientSideRowModelModule,
  ValueGetterParams,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import Swal from "sweetalert2";
import { Dialog } from "@headlessui/react";
import SyncLoader from "react-spinners/SyncLoader";
import {
  Calendar,
  DollarSign,
  EditIcon,
  Layers,
  Save,
  Tag,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setDefaultHighWaterMark } from "stream";

// Register AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);

type Expense = {
  id: number;
  clerkId: string;
  amount: number;
  category: string;
  subCategory: string;
  date: string;
};
const categories: Record<string, string[]> = {
  Food: ["Groceries", "Restaurants", "Fast Food"],
  Transport: ["Fuel", "Public Transport", "Taxi"],
  Utilities: ["Electricity", "Water", "Internet"],
};

export default function ExpenseTable(
  { dirty, setDirty }: { dirty: boolean; setDirty: React.Dispatch<React.SetStateAction<boolean>> }
) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to c

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setDirty(false)
        setLoading(true);
        const response = await fetch(
          `/api/expenses?month=${selectedMonth}&year=${selectedYear}`
        );
        const data = await response.json();

        if (data.success) {
          setExpenses(data.data);
        } else {
          setError(data.error || "Failed to fetch expenses.");
        }
      } catch {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedMonth && selectedYear) {
      fetchExpenses();
    }
  }, [selectedMonth, selectedYear,dirty]);

  // ✅ Delete Expense Function
  const handleDelete = async (id: number) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This expense will be permanently deleted!",
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
        const response = await fetch(`/api/expenses/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          setExpenses(expenses.filter((expense) => expense.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Expense has been removed.",
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

  // ✅ Open Edit Modal with Selected Expense
  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  // ✅ Handle Save (Update API)
  const handleSaveChanges = async () => {
    if (!selectedExpense) return;

    try {
      const response = await fetch(`/api/expenses/${selectedExpense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedExpense),
      });
      const data = await response.json();

      if (data.success) {
        setExpenses(
          expenses.map((exp) =>
            exp.id === selectedExpense.id ? selectedExpense : exp
          )
        );
        Swal.fire("Updated!", "Expense has been updated.", "success");
        setIsEditModalOpen(false);
      } else {
        Swal.fire("Error!", data.error || "Failed to update.", "error");
      }
    } catch {
      Swal.fire("Error!", "Something went wrong.");
    }
  };

  const columnDefs: ColDef<Expense>[] = [
    {
      headerName: "Serial No.",
      valueGetter: (params: ValueGetterParams<Expense, unknown>) => {
        return params.node?.rowIndex != null ? params.node.rowIndex + 1 : "";
      },
      width: 90,
      sortable: true,
      resizable: true,
    },
    {
      headerName: "Category",
      field: "category",
      sortable: true,
      filter: "agTextColumnFilter",
      resizable: true,
    },
    {
      headerName: "Subcategory",
      field: "subCategory",
      sortable: true,
      filter: "agTextColumnFilter",
      resizable: true,
    },
    {
      headerName: "Amount ($)",
      field: "amount",
      sortable: true,
      filter: "agNumberColumnFilter",
      resizable: true,
    },
    {
      headerName: "Date",
      field: "date",
      sortable: true,
      filter: "agDateColumnFilter",
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
      resizable: true,
    },
    {
      headerName: "Actions",
      cellRenderer: (params: { data: Expense }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(params.data)}
            className="bg-blue-700 text-white px-3 h-9 rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(params.data.id)}
            className="bg-red-700 text-white px-3 h-9 rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Delete
          </button>
        </div>
      ),
      width: 160,
      pinned: "right",
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
        <SyncLoader color="var(--foreground)" size={15} />{" "}
      </motion.div>
    );

  if (expenses.length === 0) {
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center text-[var(--foreground)] text-xl bg-[var(--background)] min-h-screen flex items-center justify-center"
    >
      No income records found.
    </motion.p>;
  }

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

  return (
    <div>
      <div className="flex center justify-center gap-10 text-[var(--foreground)]">
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
        <>
          <div className="w-full max-w-6xl bg-[var(--foreground)]/80 backdrop-blur-lg rounded-2xl shadow-2xl  flex justify-center items-center">
            <div
              className="ag-theme-alpine-dark bg-[var(--background)]"
              style={{ height: "550px", width: "100%", margin: "0 auto" }}
            >
              <h2 className="text-2xl font-bold text-center text-[var(--foreground)] py-4 bg-[var(--color-bg-end)]/50 backdrop-blur-sm">
                Expenses
              </h2>

              <AgGridReact
                rowData={expenses}
                columnDefs={columnDefs}
                modules={[ClientSideRowModelModule]}
                rowModelType="clientSide"
                animateRows={true}
                rowHeight={50}
                pagination={true}
                paginationPageSize={10}
                paginationAutoPageSize={false} // Ensure it respects paginationPageSize
                suppressPaginationPanel={false} // ✅ Ensure pagination controls are visible
                paginationPageSizeSelector={[10, 20, 50]}
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

          {/* ✅ Edit Modal */}
          <AnimatePresence>
            {isEditModalOpen && selectedExpense && (
              <Dialog
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                className="fixed inset-0 z-50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-[var(--foreground)]/70 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative bg-[var(--card-bg)] rounded-2xl shadow-2xl w-96 p-6 max-w-md mx-auto"
                >
                  <Dialog.Title className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center flex items-center justify-center gap-2">
                    <EditIcon className="text-[var(--primary)]" size={24} />
                    Edit Expense
                  </Dialog.Title>

                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-[var(--foreground)] mb-2 flex items-center gap-2 font-bold">
                        <Layers size={16} className="text-[var(--primary)]" />
                        Category
                      </label>
                      <div className="relative">
                        <select
                          value={selectedExpense.category}
                          onChange={(e) => {
                            // When category changes, set subcategory to first option of new category
                            setSelectedExpense({
                              ...selectedExpense,
                              category: e.target.value,
                              subCategory: categories[e.target.value][0],
                            });
                          }}
                          className="w-full px-4 py-2 pr-10 border border-[var(--border)] rounded-lg bg-[var(--background)]/70 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--danger)] transition-all"
                        >
                          {Object.keys(categories).map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--muted-foreground)]">
                          <Layers size={20} />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-[var(--foreground)] mb-2 flex items-center gap-2 font-bold">
                        <Tag size={16} className="text-[var(--primary)]" />
                        Subcategory
                      </label>
                      <div className="relative">
                        <select
                          value={selectedExpense.subCategory}
                          onChange={(e) =>
                            setSelectedExpense({
                              ...selectedExpense,
                              subCategory: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 pr-10 border border-[var(--border)] rounded-lg bg-[var(--background)]/70 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--danger)] transition-all"
                        >
                          {categories[selectedExpense.category]?.map(
                            (subcat) => (
                              <option key={subcat} value={subcat}>
                                {subcat}
                              </option>
                            )
                          )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--muted-foreground)]">
                          <Tag size={20} />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-[var(--foreground)] mb-2 flex items-center gap-2 font-bold">
                        <DollarSign
                          size={16}
                          className="text-[var(--primary)]"
                        />
                        Amount ($)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={selectedExpense.amount}
                          onChange={(e) =>
                            setSelectedExpense({
                              ...selectedExpense,
                              amount: parseFloat(e.target.value),
                            })
                          }
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-2 pl-10 border border-[var(--border)] rounded-lg bg-[var(--background)]/70 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--danger)] transition-all"
                        />
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-[var(--muted-foreground)]">
                          <DollarSign size={20} />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-[var(--foreground)] mb-2 flex items-center gap-2 font-bold">
                        <Calendar size={16} className="text-[var(--primary)]" />
                        Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={selectedExpense.date}
                          onChange={(e) =>
                            setSelectedExpense({
                              ...selectedExpense,
                              date: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 pr-10 border border-[var(--border)] rounded-lg bg-[var(--background)]/70 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--danger)] transition-all"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--muted-foreground)]">
                          <Calendar size={20} />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex justify-between mt-6 space-x-4">
                    <motion.button
                      onClick={() => setIsEditModalOpen(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-[var(--muted)] text-[var(--foreground)] py-2 rounded-lg hover:bg-[var(--muted-foreground)]/10 transition duration-300 flex items-center justify-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleSaveChanges}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-[var(--primary)] text-[var(--primary-foreground)] py-2 rounded-lg hover:bg-[var(--button-primary-hover)] transition duration-300 flex items-center justify-center gap-2"
                    >
                      <Save size={16} />
                      Save
                    </motion.button>
                  </div>
                </motion.div>
              </Dialog>
            )}
          </AnimatePresence>
        </>
      </motion.div>
    </div>
  );
}
