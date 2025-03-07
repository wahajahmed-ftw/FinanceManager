import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const expenses = await prisma.expenses.findMany(); // Fetch all expenses

    const totalIncome = await prisma.income.aggregate({
      _sum: { amount: true },
    });
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Group expenses by category
    const categoryExpenses: Record<string, number> = {};
    const subcategoryExpenses: Record<string, number> = {};

    expenses.forEach((expense) => {
      if (!categoryExpenses[expense.category])
        categoryExpenses[expense.category] = 0;
      categoryExpenses[expense.category] += expense.amount;

      if (!subcategoryExpenses[expense.subCategory])
        subcategoryExpenses[expense.subCategory] = 0;
      subcategoryExpenses[expense.subCategory] += expense.amount;
    });

    return NextResponse.json({
      success: true,
      data: {
        totalIncome: totalIncome._sum.amount || 0,
        totalRemaining: (totalIncome._sum.amount || 0) - totalExpenses,
        expensesByCategory: categoryExpenses,
        expensesBySubcategory: subcategoryExpenses, // Include subcategories!
      },
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
