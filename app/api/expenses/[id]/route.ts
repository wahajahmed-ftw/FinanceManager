import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: "User not authenticated." }), { status: 401 });
    }

    const { category, subCategory, amount, date } = await req.json();
    const { id } = params;

    if (!id || !category || !subCategory || isNaN(amount) || !date) {
      return new Response(JSON.stringify({ success: false, error: "Invalid input data." }), { status: 400 });
    }

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const dateParts = date.split("/");
    if (dateParts.length !== 3) {
      return new Response(JSON.stringify({ success: false, error: "Invalid date format. Expected DD/MM/YYYY." }), { status: 400 });
    }
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // YYYY-MM-DD

    const parsedDate = new Date(formattedDate);
    if (isNaN(parsedDate.getTime())) {
      return new Response(JSON.stringify({ success: false, error: "Invalid date format after conversion." }), { status: 400 });
    }

    // Check if the expense exists and belongs to the user
    const existingExpense = await prisma.expenses.findFirst({
      where: { id: Number(id), clerkId: userId },
    });

    if (!existingExpense) {
      return new Response(JSON.stringify({ success: false, error: "Expense not found or unauthorized." }), { status: 404 });
    }

    // Update the expense in the database
    const updatedExpense = await prisma.expenses.update({
      where: { id: Number(id) },
      data: { category, subCategory, amount, date: parsedDate },
    });

    return new Response(JSON.stringify({ success: true, expense: updatedExpense }), { status: 200 });
  } catch (error) {
    console.error("Error updating expense:", error);
    return new Response(JSON.stringify({ success: false, error: "Database error." }), { status: 500 });
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: "User not authenticated." }), { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: "Invalid input data." }), { status: 400 });
    }

    const existingExpense = await prisma.expenses.findFirst({
      where: { id: Number(id), clerkId: userId },
    });

    if (!existingExpense) {
      return new Response(JSON.stringify({ success: false, error: "Expense not found or unauthorized." }), { status: 404 });
    }

    await prisma.expenses.delete({
      where: { id: Number(id), clerkId:userId },
    });

    return new Response(JSON.stringify({ success: true, message: "Expense deleted successfully." }), { status: 200 });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return new Response(JSON.stringify({ success: false, error: "Database error." }), { status: 500 });
  }
}
