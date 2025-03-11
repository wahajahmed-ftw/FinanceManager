import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const authResult = await auth();
    const { userId } = authResult; // Get Clerk ID from session

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!month || !year) {
      return NextResponse.json(
        { error: "Month and year are required" },
        { status: 400 }
      );
    }

    // Get the start and end of the selected month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of the month

    // Fetch income data for the selected month
    const income = await prisma.income.findMany({
      where: {
        clerkId: userId,
        date: {
          gte: startDate, // Greater than or equal to startDate
          lte: endDate, // Less than or equal to endDate
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(income);
  } catch (error) {
    console.error("Error fetching income:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

