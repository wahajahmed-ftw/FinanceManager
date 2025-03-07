import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: "User not authenticated." }), { status: 401 });
    }

    const { source, amount, date } = await req.json();
    const { id } = params;

    if (!id || !source || isNaN(amount) || !date) {
      return new Response(JSON.stringify({ success: false, error: "Invalid input data." }), { status: 400 });
    }

    // Convert DD/MM/YYYY to ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
    const dateParts = date.split("/");
    if (dateParts.length !== 3) {
      return new Response(JSON.stringify({ success: false, error: "Invalid date format. Expected DD/MM/YYYY." }), { status: 400 });
    }

    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00.000Z`; // Converts to UTC
    const parsedDate = new Date(formattedDate);

    if (isNaN(parsedDate.getTime())) {
      return new Response(JSON.stringify({ success: false, error: "Invalid date format after conversion." }), { status: 400 });
    }

    // Ensure the income exists and belongs to the user
    const existingIncome = await prisma.income.findFirst({
      where: { id: Number(id), clerkId: userId },
    });

    if (!existingIncome) {
      return new Response(JSON.stringify({ success: false, error: "Income not found or unauthorized." }), { status: 404 });
    }

    // Update the income entry
    const updatedIncome = await prisma.income.update({
      where: { id: Number(id) },
      data: { source, amount, date: parsedDate },
    });

    return new Response(JSON.stringify({ success: true, income: updatedIncome }), { status: 200 });
  } catch (error) {
    console.error("Error updating income:", error);
    return new Response(JSON.stringify({ success: false, error: "Database error." }), { status: 500 });
  }
}



export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      const { userId } = await auth();
      if (!userId) return Response.json({ success: false, error: "User not authenticated." }, { status: 401 });
  
      const income = await prisma.income.findUnique({
        where: { id: Number(params.id) },
      });
  
      if (!income || income.clerkId !== userId) return Response.json({ success: false, error: "Unauthorized" }, { status: 403 });
  
      await prisma.income.delete({ where: { id: Number(params.id) } });
  
      return Response.json({ success: true, message: "Income deleted successfully." }, { status: 200 });
    } catch (error) {
      console.error("Error deleting income:", error);
      return Response.json({ success: false, error: "Database error." }, { status: 500 });
    }
  }