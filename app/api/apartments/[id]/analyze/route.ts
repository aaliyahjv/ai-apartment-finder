import { NextResponse } from "next/server";
import { generateApartmentAnalysis } from "@/lib/apartment-analysis";
import { isValidApartmentId } from "@/lib/apartment-id";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!isValidApartmentId(id)) {
    return NextResponse.json({ error: "Invalid apartment ID" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI analysis is not configured" },
      { status: 503 },
    );
  }

  try {
    const apartment = await prisma.apartment.findUnique({
      where: { id },
    });

    if (!apartment) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }

    const analysis = await generateApartmentAnalysis(apartment);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error(`POST /api/apartments/${id}/analyze failed:`, error);
    return NextResponse.json(
      { error: "Failed to generate apartment analysis" },
      { status: 500 },
    );
  }
}
