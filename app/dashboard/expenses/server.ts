"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addExpense(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not authenticated." };
  }

  const category = formData.get("category") as string;
  const subCategory = formData.get("subcategory") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const date = formData.get("date") as string;


  if (!category || !subCategory || isNaN(amount)) {
    return { success: false, error: "Invalid input data." };
  }

  try {
    await prisma.expenses.create({
      data: {
        clerkId: userId,
        category,
        subCategory,
        amount,
        date: new Date(date),
      },
    });
    console.log("Expense added successfully!");
    revalidatePath("/dashboard/expenses");
    return { success: true, message: "Expense added successfully!" };
  } catch (error: any) {
    console.error("Error adding expense:", error);
    return { success: false, error: "Database error." };
  }
}
