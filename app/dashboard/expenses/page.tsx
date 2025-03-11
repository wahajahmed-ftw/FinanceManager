"use client";
import { useState } from "react";
import ExpenseFormPopup from "./ExpenseForm/expenseForm";
import ExpenseTable from "./ExpenseTable/expenseTable";

export default function Expenses() {
  const [dirty,setDirty] = useState(false)
  return (
    <div>
      <ExpenseFormPopup setDirty={setDirty}/>
      <ExpenseTable dirty={dirty} setDirty={setDirty}/>
    </div>
  );
}
