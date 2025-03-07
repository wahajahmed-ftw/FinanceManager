import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"; // Ensure the correct Prisma import

export async function GET() {
  try {
    const { userId } = await auth(); // Get the Clerk User ID

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated." },
        { status: 401 },
      );
    }

    const expenses = await prisma.expenses.findMany({
      where: { clerkId: userId }, // Filter by the authenticated user's Clerk ID
      orderBy: { date: "asc" }, // Latest expenses first
    });

    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch expenses." },
      { status: 500 },
    );
  }
}
