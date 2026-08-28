import type { Apartment } from "@/types/apartment";
import type { ApartmentAnalysis } from "@/types/apartment-analysis";
import { getOpenAIClient } from "@/lib/openai";
import { parseApartmentAnalysisJson } from "@/lib/parse-apartment-analysis";

const ANALYSIS_MODEL = "gpt-4o-mini";

const ANALYSIS_INSTRUCTIONS = `You assess apartment rental listings for prospective renters.

Rules:
- Use ONLY facts present in the provided listing JSON.
- Do not invent amenities, policies, commute times, safety ratings, or neighborhood details.
- Include 1–2 potential concerns in the concerns array when supported by the listing data. Keep each concern to one short sentence.
- Valid concerns include explicit tradeoffs visible in listing fields, such as limited square footage for the listed layout or a studio layout for renters who need separate living and sleeping spaces.
- Valid concerns also include important renter information not specified in the provided JSON (for example, parking, laundry, or pet policy), phrased explicitly as "not specified in the listing".
- Do not invent commute times, safety claims, neighborhood character, policies, amenities, or other facts not present in the JSON.
- If there is genuinely no supported concern, return an empty concerns array.
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

  return parseApartmentAnalysisJson(outputText);
}
