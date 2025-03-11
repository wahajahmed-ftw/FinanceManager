// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";

// export async function GET() {
//   try {
//     const { userId } = await auth(); // Get Clerk User ID
//     if (!userId) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Fetch expenses for the logged-in user
//     const expenses = await prisma.expenses.findMany({
//       where: { clerkId: userId },
//     });

//     // Fetch total income for the logged-in user
//     const totalIncome = await prisma.income.aggregate({
//       where: { clerkId: userId },
//       _sum: { amount: true },
//     });

//     const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

//     // Group expenses by category
//     const categoryExpenses: Record<string, number> = {};
//     const subcategoryExpenses: Record<string, number> = {};

//     expenses.forEach((expense) => {
//       if (!categoryExpenses[expense.category]) {
//         categoryExpenses[expense.category] = 0;
//       }
//       categoryExpenses[expense.category] += expense.amount;

//       if (!subcategoryExpenses[expense.subCategory]) {
//         subcategoryExpenses[expense.subCategory] = 0;
//       }
//       subcategoryExpenses[expense.subCategory] += expense.amount;
//     });

//     return NextResponse.json({
//       success: true,
//       data: {
//         totalIncome: totalIncome._sum.amount || 0,
//         totalRemaining: (totalIncome._sum.amount || 0) - totalExpenses,
//         expensesByCategory: categoryExpenses,
//         expensesBySubcategory: subcategoryExpenses, // Include subcategories!
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching expenses:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch data" },
//       { status: 500 }
//     );
//   }
// }



import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth(); // No need to await auth()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const month = Number(url.searchParams.get("month"));
    const year = Number(url.searchParams.get("year"));

    // Validate month and year
    if (!month || month < 1 || month > 12 || !year) {
      return NextResponse.json(
        { success: false, error: "Invalid month or year parameter" },
        { status: 400 }
      );
    }

    // Calculate date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1); // First day of next month

    // Fetch expenses
    const expenses = await prisma.expenses.findMany({
      where: {
        clerkId: userId,
        date: {
          gte: startDate,
          lt: endDate, // Use lt (less than) for correct month-end boundary
        },
      },
    });

    // Fetch income
    const income = await prisma.income.findMany({
      where: {
        clerkId: userId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Group expenses by category & subcategory
    const categoryExpenses: Record<string, number> = {};
    const subcategoryExpenses: Record<string, number> = {};

    expenses.forEach(({ category, subCategory, amount }) => {
      categoryExpenses[category] = (categoryExpenses[category] || 0) + amount;
      subcategoryExpenses[subCategory] =
        (subcategoryExpenses[subCategory] || 0) + amount;
    });

    return NextResponse.json({
      success: true,
      data: {
        month,
        year,
        totalIncome,
        totalExpenses,
        totalRemaining: totalIncome - totalExpenses,
        expensesByCategory: categoryExpenses,
        expensesBySubcategory: subcategoryExpenses,
      },
    });
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch monthly data" },
      { status: 500 }
    );
  }
}
