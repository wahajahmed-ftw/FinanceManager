import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const authResult = await auth();
    const { userId } = authResult; // Get Clerk ID from session
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const income = await prisma.income.findMany({
      where: { clerkId: userId }, // Fetch only the logged-in user's income
      orderBy: { date: "desc" },
    });

    return NextResponse.json(income);
  } catch (error) {
    console.error("Error fetching income:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
