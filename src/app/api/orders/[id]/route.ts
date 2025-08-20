import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const od = await db.collection("orders").doc(id).get();
  if (!od.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const order = { id: od.id, ...(od.data() as any) };
  let listing: any = null;

  if (order.listingId) {
    const ld = await db.collection("listings").doc(order.listingId).get();
    if (ld.exists) listing = { id: ld.id, ...(ld.data() as any) };
  }

  return NextResponse.json({ order, listing });
}