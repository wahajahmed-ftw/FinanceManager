import ExpenseForm from "./ExpenseForm/expenseForm";
import ExpenseTable from "./ExpenseTable/expenseTable";

export default function Expenses() {
    return (
        <div>
            <h1>Expenses Page</h1>
            <ExpenseForm/>
            <ExpenseTable/>
        </div>
    );
}