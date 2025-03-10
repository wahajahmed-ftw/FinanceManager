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


export default function ExpenseTable() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses");
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
    fetchExpenses();
  }, []);

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
      headerName: "ID",
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
        className="flex justify-center items-center h-screen bg-gray-900"
      >
        <SyncLoader color="var(--foreground)" size={15} />{" "}
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

  return (
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
              theme={myTheme}
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
                // theme: {
                //   background: "var(--foreground)", // Reset to var(--foreground)
                //   headerBackground: "var(--muted)", // Darker header background
                //   headerText: "var(--primary)", // Lighter text for better contrast
                //   rowHover: "var(--muted)/50", // Softer hover effect
                //   text: "var(--primary)", // Off-white text for readability
                //   border: "var(--borders)", // Subtle border color
                // },
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
                className="fixed inset-0 bg-[var(--)]/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative bg-[var(--foreground)] rounded-2xl shadow-2xl w-96 p-6 max-w-md mx-auto"
              >
                <Dialog.Title className="text-2xl font-bold text-[var(--primary)] mb-6 text-center">
                  Edit Expense
                </Dialog.Title>

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-[var(--primary)] mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={selectedExpense.category}
                      onChange={(e) =>
                        setSelectedExpense({
                          ...selectedExpense,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-[var(--borders)] rounded-lg bg-[var(--muted)] text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--success)] transition duration-300"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-[var(--primary)] mb-2">
                      Sub Category
                    </label>
                    <input
                      type="text"
                      value={selectedExpense.subCategory}
                      onChange={(e) =>
                        setSelectedExpense({
                          ...selectedExpense,
                          subCategory: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-[var(--borders)] rounded-lg bg-[var(--muted)] text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--success)] transition duration-300"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-[var(--primary)] mb-2">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      value={selectedExpense.amount}
                      onChange={(e) =>
                        setSelectedExpense({
                          ...selectedExpense,
                          amount: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-[var(--borders)] rounded-lg bg-[var(--muted)] text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--success)] transition duration-300"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-[var(--primary)] mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedExpense.date}
                      onChange={(e) =>
                        setSelectedExpense({
                          ...selectedExpense,
                          date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-[var(--borders)] rounded-lg bg-[var(--muted)] text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--success)] transition duration-300"
                    />
                  </motion.div>
                </div>

                <div className="flex justify-between mt-6 space-x-4">
                  <motion.button
                    onClick={() => setIsEditModalOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-[var(--muted)] text-[var(--primary)] py-2 rounded-lg hover:bg-[var(--foreground)] transition duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSaveChanges}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-[var(--success)] text-white py-2 rounded-lg hover:shadow-lg transition duration-300"
                  >
                    Save
                  </motion.button>
                </div>
              </motion.div>
            </Dialog>
          )}
        </AnimatePresence>
      </>
    </motion.div>
  );
}
