import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { billing } from "@repo/billing";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  try {
    const result = await billing.handleWebhook(body, signature);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Webhook handler failed", { status: 400 });
  }
}
