"use client";
import { useState } from "react";
import ExpenseForm from "./ExpenseForm/expenseForm";
import ExpenseTable from "./ExpenseTable/expenseTable";

export default function Expenses() {
  const [dirty,setDirty] = useState(false)
  return (
    <div>
      <ExpenseForm setDirty={setDirty}/>
      <ExpenseTable dirty={dirty} setDirty={setDirty}/>
    </div>
  );
}
