import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ success: false, error: "User not authenticated." }, { status: 401 });

    const { source, amount, date } = await req.json();
    if (!source || isNaN(amount) || !date) return Response.json({ success: false, error: "Invalid input." }, { status: 400 });

    const income = await prisma.income.update({
      where: { id: Number(params.id), clerkId: userId },
      data: { source, amount, date: new Date(date) },
    });

    return Response.json({ success: true, income }, { status: 200 });
  } catch (error) {
    console.error("Error updating income:", error);
    return Response.json({ success: false, error: "Database error." }, { status: 500 });
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