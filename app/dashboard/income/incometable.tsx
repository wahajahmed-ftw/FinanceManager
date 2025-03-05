  "use client";

  import { useEffect, useState } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { Dialog } from "@headlessui/react";
  import { AgGridReact } from "ag-grid-react";
  import { ColDef } from "ag-grid-community";
  import { ClientSideRowModelModule, ModuleRegistry } from "ag-grid-community";
  import { themeBalham } from 'ag-grid-community';


  // Import AG Grid styles
  import "ag-grid-community/styles/ag-grid.css";
  import "ag-grid-community/styles/ag-theme-alpine.css";

  import Swal from "sweetalert2";

  // Register modules 
  ModuleRegistry.registerModules([ClientSideRowModelModule]);

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
    const [isOpen, setIsOpen] = useState(false);
    const [editingIncome, setEditingIncome] = useState<Income | null>(null);

    useEffect(() => {
      fetchIncome();
    }, []);

    const fetchIncome = async () => {
      try {
        const res = await fetch(`/api/income`);
        if (!res.ok) throw new Error("Failed to fetch income data");

        const data = await res.json();
        setIncomeData(
          data.map((income: Income) => ({
            ...income,
            date: new Date(income.date).toLocaleDateString(),
          }))
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = async (id: number) => {
      const confirmDelete = await Swal.fire({
        title: "Are you sure?",
        text: "This income entry will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        background: 'rgb(31, 41, 55)', 
        color: 'white',
        backdrop: 'rgba(0,0,0,0.7)',
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
              background: 'rgb(31, 41, 55)',
              color: 'white',
              backdrop: 'rgba(0,0,0,0.7)',
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: data.error || "Failed to delete.",
              icon: "error",
              background: 'rgb(31, 41, 55)',
              color: 'white',
              backdrop: 'rgba(0,0,0,0.7)',
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Something went wrong.",
            icon: "error",
            background: 'rgb(31, 41, 55)',
            color: 'white',
            backdrop: 'rgba(0,0,0,0.7)',
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

        fetchIncome(); 
        setIsOpen(false);
      } catch (err: any) {
        Swal.fire({
          title: "Error!",
          text: err.message,
          icon: "error",
          background: 'rgb(31, 41, 55)',
          color: 'white',
          backdrop: 'rgba(0,0,0,0.7)',
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
        headerClass: "!text-gray-200 font-semibold",
        cellClass: "text-gray-300 hover:bg-gray-700 transition-colors duration-200"
      },
      { 
        field: "date", 
        headerName: "Date", 
        sortable: true, 
        filter: "agDateColumnFilter", 
        resizable: true,
        headerClass: "!text-gray-200 font-semibold",
        cellClass: "text-gray-300 hover:bg-gray-700 transition-colors duration-200"
      },
      { 
        field: "amount", 
        headerName: "Amount ($)", 
        sortable: true, 
        filter: true, 
        resizable: true,
        headerClass: "!text-gray-200 font-semibold",
        cellClass: "text-gray-300 font-medium hover:bg-gray-700 transition-colors duration-200",
        valueFormatter: (params) => `$${params.value.toLocaleString()}`
      },
      {
        headerName: "Actions",
        cellRenderer: (params: any) => (
          <div className="flex gap-2 items-center justify-center h-full">
            <motion.button 
              onClick={() => openEditDialog(params.data)} 
              className="bg-blue-700 text-white px-3  h-9  rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Edit
            </motion.button>
            <motion.button 
              onClick={() => handleDelete(params.data.id)} 
              className="bg-red-700 text-white px-3 h-9 rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete
            </motion.button>
          </div>
        ),
      },
    ];

    if (loading) return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center h-screen bg-gray-900"
      >
        <p className="text-xl text-gray-300">Loading income data...</p>
      </motion.div>
    );

    if (error) return (
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-red-500 text-xl bg-gray-900 min-h-screen flex items-center justify-center"
      >
        {error}
      </motion.p>
    );

    if (incomeData.length === 0) return (
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center text-gray-300 text-xl bg-gray-900 min-h-screen flex items-center justify-center"
      >
        No income records found.
      </motion.p>
    );

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-900 flex items-center justify-center p-4"
      >
      {/* <div className="w-full max-w-6xl bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
    <div className="ag-theme-alpine-dark bg-gray-900" style={{ height: "500px", width: "100%", margin: "0 auto" }}>
      <h2 className="text-2xl font-bold text-center text-gray-200 py-4 bg-gray-800/50 backdrop-blur-sm">
        Income Records
      </h2>

      <AgGridReact
        className="ag-theme-alpine-dark"
        rowData={incomeData}
        columnDefs={columnDefs}
        modules={[ClientSideRowModelModule]}
        rowModelType="clientSide"
        animateRows={true}
        
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
        rowHeight={50}
        gridOptions={{
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
  </div> */}
  <div className="w-full max-w-6xl bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
  <div className="ag-theme-alpine-dark bg-gray-900" style={{ height: "500px", width: "100%", margin: "0 auto" }}>
    <h2 className="text-2xl font-bold text-center text-gray-200 py-4 bg-gray-800/50 backdrop-blur-sm">
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


        <AnimatePresence>
          {isOpen && (
            <Dialog 
              open={isOpen} 
              onClose={() => setIsOpen(false)} 
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
                  Edit Income Entry
                </Dialog.Title>

                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-gray-300 mb-2">Source</label>
                    <input
                      type="text"
                      value={editingIncome?.source || ""}
                      onChange={(e) => setEditingIncome({ ...editingIncome!, source: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-gray-300 mb-2">Amount ($)</label>
                    <input
                      type="number"
                      value={editingIncome?.amount || ""}
                      onChange={(e) => setEditingIncome({ ...editingIncome!, amount: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={editingIncome?.date.split("/").reverse().join("-") || ""}
                      onChange={(e) => setEditingIncome({ ...editingIncome!, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    />
                  </motion.div>
                </div>

                <div className="flex justify-between mt-6 space-x-4">
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleEdit}
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
      </motion.div>
    );
  }