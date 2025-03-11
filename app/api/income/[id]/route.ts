import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "User not authenticated." }),
        { status: 401 },
      );
    }

    const { source, amount, date } = await req.json();
    const id = req.nextUrl.pathname.split("/").pop();
    
    if (!id || !source || isNaN(amount) || !date) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid input data." }),
        { status: 400 },
      );
    }

    // ✅ Fix: No need to manually parse DD/MM/YYYY. The frontend already sends YYYY-MM-DD.
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid date format." }),
        { status: 400 },
      );
    }

    // Ensure the income exists and belongs to the user
    const existingIncome = await prisma.income.findFirst({
      where: { id: Number(id), clerkId: userId },
    });

    if (!existingIncome) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Income not found or unauthorized.",
        }),
        { status: 404 },
      );
    }

    // Update the income entry
    const updatedIncome = await prisma.income.update({
      where: { id: Number(id) },
      data: { source, amount, date: parsedDate },
    });

    return new Response(
      JSON.stringify({ success: true, income: updatedIncome }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating income:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Database error." }),
      { status: 500 },
    );
  }
}


export async function DELETE(req: NextRequest,) {
  try {
    const { userId } = await auth();
    if (!userId)
      return Response.json(
        { success: false, error: "User not authenticated." },
        { status: 401 },
      );
      const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invalid input data." },
        { status: 400 }
      );
    }


    const income = await prisma.income.findUnique({
      where: { id: Number(id) },
    });

    if (!income || income.clerkId !== userId)
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );

    await prisma.income.delete({ where: { id: Number(id) } });

    return Response.json(
      { success: true, message: "Income deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting income:", error);
    return Response.json(
      { success: false, error: "Database error." },
      { status: 500 },
    );
  }
}
