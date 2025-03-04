import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const expenses = await prisma.expenses.findMany();
    
    const totalIncome = await prisma.income.aggregate({ _sum: { amount: true } });
    const totalExpenses = expenses.reduce((sum: number, exp: { amount: number }) => sum + exp.amount, 0);

    // Group expenses by category with correct typing
    const categoryExpenses = expenses.reduce((acc: Record<string, number>, exp: { category: string; amount: number }) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {});
      

    return NextResponse.json({
      success: true,
      data: {
        totalIncome: totalIncome._sum.amount || 0,
        totalRemaining: (totalIncome._sum.amount || 0) - totalExpenses,
        expensesByCategory: categoryExpenses
      }
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch data" }, { status: 500 });
  }
}
