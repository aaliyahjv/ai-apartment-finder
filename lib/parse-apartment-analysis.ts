import type { ApartmentAnalysis } from "@/types/apartment-analysis";

export function parseApartmentAnalysisJson(raw: string): ApartmentAnalysis {
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
