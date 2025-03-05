"use client";

import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ColDef, ModuleRegistry, ClientSideRowModelModule, GridOptions, SelectionChangedEvent
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Swal from "sweetalert2";
import { Dialog } from "@headlessui/react";

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
      } catch (err) {
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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
        const data = await response.json();
        if (data.success) {
          setExpenses(expenses.filter(expense => expense.id !== id));
          Swal.fire("Deleted!", "Expense has been removed.", "success");
        } else {
          Swal.fire("Error!", data.error || "Failed to delete.", "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong.", "error");
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
        setExpenses(expenses.map(exp => (exp.id === selectedExpense.id ? selectedExpense : exp)));
        Swal.fire("Updated!", "Expense has been updated.", "success");
        setIsEditModalOpen(false);
      } else {
        Swal.fire("Error!", data.error || "Failed to update.", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  // ✅ Column Definitions with Actions
  // const columnDefs: ColDef<Expense>[] = [
  //   { headerName: "ID", field: "id", width: 90, sortable: true, filter: "agNumberColumnFilter", resizable: true },
  //   { headerName: "Category", field: "category", sortable: true, filter: "agTextColumnFilter", resizable: true },
  //   { headerName: "Subcategory", field: "subCategory", sortable: true, filter: "agTextColumnFilter", resizable: true },
  //   { headerName: "Amount ($)", field: "amount", sortable: true, filter: "agNumberColumnFilter", resizable: true },
  //   { 
  //     headerName: "Date",
  //     field: "date",
  //     sortable: true,
  //     filter: "agDateColumnFilter",
  //     valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
  //     resizable: true,
  //   },
  //   {
  //     headerName: "Actions",
  //     cellRenderer: (params: any) => (
  //       <div className="flex gap-2">
  //         <button onClick={() => handleEdit(params.data)} className="bg-blue-700 text-white px-3  h-9  rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
  //         >Edit</button>
  //         <button onClick={() => handleDelete(params.data.id)} className="bg-red-700 text-white px-3 h-9 rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">Delete</button>
  //       </div>
  //     ),
  //     width: 160,
  //     pinned: "right",
  //   },
  // ];
  const columnDefs: ColDef<Expense>[] = [
    { 
      headerName: "ID", 
      valueGetter: (params) => params.node ? params.node.rowIndex + 1 : "", // Generates row index (1-based)
      width: 90, 
      sortable: true, 
      resizable: true 
    },
    { headerName: "Category", field: "category", sortable: true, filter: "agTextColumnFilter", resizable: true },
    { headerName: "Subcategory", field: "subCategory", sortable: true, filter: "agTextColumnFilter", resizable: true },
    { headerName: "Amount ($)", field: "amount", sortable: true, filter: "agNumberColumnFilter", resizable: true },
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
      cellRenderer: (params: any) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(params.data)} className="bg-blue-700 text-white px-3 h-9 rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >Edit</button>
          <button onClick={() => handleDelete(params.data.id)} className="bg-red-700 text-white px-3 h-9 rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">Delete</button>
        </div>
      ),
      width: 160,
      pinned: "right",
    },
  ];
  

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-900 flex items-center justify-center p-4"
      >

    <>
    <div className="w-full max-w-6xl bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl  flex justify-center items-center">
  <div className="ag-theme-alpine-dark bg-gray-900" style={{ height: "550px", width: "100%", margin: "0 auto" }}>
    <h2 className="text-2xl font-bold text-center text-gray-200 py-4 bg-gray-800/50 backdrop-blur-sm">
      Expenses 
    </h2>

    <AgGridReact
      className="ag-theme-alpine-dark"
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
        theme: {
          background: 'bg-gray-800', // Reset to bg-gray-800
          headerBackground: 'rgb(45, 55, 72)', // Darker header background
          headerText: 'rgb(229, 231, 235)', // Lighter text for better contrast
          rowHover: 'rgba(75, 85, 99, 0.5)', // Softer hover effect
          text: 'rgb(226, 232, 240)', // Off-white text for readability
          border: 'rgb(58, 70, 91)', // Subtle border color
          
        }   
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
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative bg-gray-800 rounded-2xl shadow-2xl w-96 p-6 max-w-md mx-auto"
      >
        <Dialog.Title className="text-2xl font-bold text-gray-200 mb-6 text-center">
          Edit Expense
        </Dialog.Title>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label className="block text-gray-300 mb-2">Category</label>
            <input
              type="text"
              value={selectedExpense.category}
              onChange={(e) => setSelectedExpense({ ...selectedExpense, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <label className="block text-gray-300 mb-2">Sub Category</label>
            <input
              type="text"
              value={selectedExpense.subCategory}
              onChange={(e) => setSelectedExpense({ ...selectedExpense, subCategory: e.target.value })}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <label className="block text-gray-300 mb-2">Amount ($)</label>
            <input
              type="number"
              value={selectedExpense.amount}
              onChange={(e) => setSelectedExpense({ ...selectedExpense, amount: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <label className="block text-gray-300 mb-2">Date</label>
            <input
              type="date"
              value={selectedExpense.date}
              onChange={(e) => setSelectedExpense({ ...selectedExpense, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </motion.div>
        </div>

        <div className="flex justify-between mt-6 space-x-4">
          <motion.button
            onClick={() => setIsEditModalOpen(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleSaveChanges}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-blue-700 text-white py-2 rounded-lg hover:shadow-lg transition duration-300"
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
