"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function addIncome(formData: FormData) {
  const { userId } = await auth(); // Get Clerk User ID from session

  if (!userId) {
    return { success: false, error: "User not authenticated." };
  }

  const source = formData.get("source") as string;
  const date = formData.get("date") as string;
  const amount = parseFloat(formData.get("amount") as string);

  if (!source || !date || isNaN(amount)) {
    return { success: false, error: "Invalid input data." };
  }

  try {
    await prisma.income.create({
      data: {
        clerkId: userId,
        source,
        date: new Date(date),
        amount,
      },
    });
    return { success: true, message: "Income added successfully!" };
  } catch (error) {
    console.error("Error adding income:", error);
    return { success: false, error: "Database error." };
  }
}
