import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Apartment } from "@/types/apartment";

export async function GET() {
  try {
    const apartments: Apartment[] = await prisma.apartment.findMany({
      orderBy: [{ city: "asc" }, { neighborhood: "asc" }, { rent: "asc" }],
    });

    return NextResponse.json(apartments);
  } catch (error) {
    console.error("GET /api/apartments failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch apartments" },
      { status: 500 },
    );
  }
}
