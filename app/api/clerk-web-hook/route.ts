import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received Webhook Data:", JSON.stringify(body, null, 2)); // ✅ Log full webhook payload

    if (!body.type || !body.data) {
      throw new Error("Invalid webhook payload structure");
    }

    console.log(`Processing event: ${body.type}`);

    if (body.type === "user.deleted") {
      // Ensure user ID exists before deleting
      const { id } = body.data;
      if (!id) {
        throw new Error("Missing user ID for deletion event");
      }

      await prisma.user.deleteMany({
        where: { clerkId: id },
      });

      console.log(`✅ User with ID: ${id} deleted from DB`);
      return NextResponse.json({ success: true });
    }

    // For other events (user.created, user.updated)
    const { id, first_name, last_name, email_addresses } = body.data;

    if (!id || !email_addresses || email_addresses.length === 0) {
      throw new Error("Missing required user data");
    }

    const user = await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email: email_addresses[0]?.email_address,
        name: `${first_name} ${last_name}`,
      },
      create: {
        clerkId: id,
        name: `${first_name} ${last_name}`,
        email: email_addresses[0]?.email_address,
      },
    });

    console.log("✅ User upserted in DB:", user);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error handling webhook:", error);
    
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Database error." },
      { status: 500 }
    );
}
