"use client";

import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { 
  ColDef, ModuleRegistry, ClientSideRowModelModule, 
  GridOptions, SelectionChangedEvent
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

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

  // ✅ Column Definitions with All Features Enabled
  const columnDefs: ColDef<Expense>[] = [
    { headerName: "ID", field: "id", width: 90, sortable: true, filter: "agNumberColumnFilter", resizable: true, pinned: "left" },
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
  ];

  // ✅ AG Grid Options for Additional Features
  const gridOptions: GridOptions<Expense> = {
    rowSelection: "multiple", // Enables row selection
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 50], // Allows users to select page size
    animateRows: true, // Smooth animations when sorting/filtering
    suppressDragLeaveHidesColumns: true, // Prevents accidental column hiding
    enableRangeSelection: true, // Allows selecting multiple rows
    enableCharts: true, // Allows charting
    enableSorting: true, // Enables sorting
    enableFilter: true, // Enables filtering
    domLayout: "autoHeight", // Adjusts height automatically
  };

  // ✅ Handle Row Selection
  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    console.log("Selected Rows:", selectedRows);
  };

  return (
    <div className="ag-theme-alpine w-full h-[500px] mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">Expense List</h2>

      {loading && <p className="text-gray-400">Loading expenses...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <AgGridReact
          rowData={expenses}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          onSelectionChanged={onSelectionChanged}
        />
      )}
    </div>
  );
}
