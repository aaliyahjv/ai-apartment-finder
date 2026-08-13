import type { Apartment } from "@/types/apartment";
import type { ApartmentAnalysis } from "@/types/apartment-analysis";
import { getOpenAIClient } from "@/lib/openai";

const ANALYSIS_MODEL = "gpt-4o-mini";

const ANALYSIS_INSTRUCTIONS = `You assess apartment rental listings for prospective renters.

Rules:
- Use ONLY facts present in the provided listing JSON.
- Do not invent amenities, policies, commute times, safety ratings, or neighborhood details.
- If information is missing or unclear, mention that as a concern instead of guessing.
- Keep each list item short (one sentence max).
- Return valid JSON only, with this exact shape:
{"pros":["..."],"concerns":["..."],"bestSuitedFor":"..."}`;

type ApartmentAnalysisPayload = {
  title: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  amenities: string[];
  description: string;
};

function toAnalysisPayload(apartment: Apartment): ApartmentAnalysisPayload {
  return {
    title: apartment.title,
    address: apartment.address,
    neighborhood: apartment.neighborhood,
    city: apartment.city,
    state: apartment.state,
    zipCode: apartment.zipCode,
    rent: apartment.rent,
    bedrooms: apartment.bedrooms,
    bathrooms: apartment.bathrooms,
    squareFeet: apartment.squareFeet,
    amenities: apartment.amenities,
    description: apartment.description,
  };
}

function parseAnalysisJson(raw: string): ApartmentAnalysis {
  const trimmed = raw.trim();
  const jsonText = trimmed.startsWith("```")
    ? trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
    : trimmed;

  const parsed: unknown = JSON.parse(jsonText);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !Array.isArray((parsed as ApartmentAnalysis).pros) ||
    !Array.isArray((parsed as ApartmentAnalysis).concerns) ||
    typeof (parsed as ApartmentAnalysis).bestSuitedFor !== "string"
  ) {
    throw new Error("Invalid analysis response format");
  }

  const analysis = parsed as ApartmentAnalysis;
  return {
    pros: analysis.pros.filter((item): item is string => typeof item === "string"),
    concerns: analysis.concerns.filter(
      (item): item is string => typeof item === "string",
    ),
    bestSuitedFor: analysis.bestSuitedFor.trim(),
  };
}

export async function generateApartmentAnalysis(
  apartment: Apartment,
): Promise<ApartmentAnalysis> {
  const client = getOpenAIClient();
  const listing = toAnalysisPayload(apartment);

  const response = await client.responses.create({
    model: ANALYSIS_MODEL,
    instructions: ANALYSIS_INSTRUCTIONS,
    input: `Analyze this apartment listing:\n${JSON.stringify(listing)}`,
    max_output_tokens: 450,
    store: false,
  });

  const outputText = response.output_text?.trim();
  if (!outputText) {
    throw new Error("Empty analysis response from OpenAI");
  }

  return parseAnalysisJson(outputText);
}
