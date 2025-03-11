import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"; // Ensure the correct Prisma import
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "User not authenticated." }, { status: 401 });
    }

    const url = new URL(req.url);
    const month = Number(url.searchParams.get("month")); // Get month from query params
    const year = Number(url.searchParams.get("year")); // Get year from query params

    const whereClause: Prisma.ExpensesWhereInput = { clerkId: userId };

    if (month && year) {
      whereClause.date = {
        gte: new Date(year, month - 1, 1), // Start of the month
        lt: new Date(year, month, 1), // Start of the next month
      };
    }

    const expenses = await prisma.expenses.findMany({
      where: whereClause,
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch expenses." }, { status: 500 });
  }
}