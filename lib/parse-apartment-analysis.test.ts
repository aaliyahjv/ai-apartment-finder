import { describe, expect, it } from "vitest";
import { parseApartmentAnalysisJson } from "@/lib/parse-apartment-analysis";

const validAnalysis = {
  pros: ["Good natural light", "In-unit laundry"],
  concerns: ["Higher rent for the neighborhood"],
  bestSuitedFor: "Professionals who want a walkable location.",
};

describe("parseApartmentAnalysisJson", () => {
  it("parses valid analysis JSON", () => {
    expect(parseApartmentAnalysisJson(JSON.stringify(validAnalysis))).toEqual(
      validAnalysis,
    );
  });

  it("parses fenced JSON code blocks", () => {
    const fenced = `\`\`\`json
${JSON.stringify(validAnalysis, null, 2)}
\`\`\``;

    expect(parseApartmentAnalysisJson(fenced)).toEqual(validAnalysis);
  });

  it("trims whitespace around bestSuitedFor", () => {
    const result = parseApartmentAnalysisJson(
      JSON.stringify({
        ...validAnalysis,
        bestSuitedFor: "  Remote workers seeking quiet space.  ",
      }),
    );

    expect(result.bestSuitedFor).toBe("Remote workers seeking quiet space.");
  });

  it("throws on invalid JSON", () => {
    expect(() => parseApartmentAnalysisJson("{not json")).toThrow(SyntaxError);
  });

  it("throws when required fields are missing", () => {
    expect(() =>
      parseApartmentAnalysisJson(
        JSON.stringify({
          pros: ["Bright unit"],
          concerns: ["Small kitchen"],
        }),
      ),
    ).toThrow("Invalid analysis response format");

    expect(() =>
      parseApartmentAnalysisJson(
        JSON.stringify({
          pros: "Not an array",
          concerns: [],
          bestSuitedFor: "Anyone",
        }),
      ),
    ).toThrow("Invalid analysis response format");
  });

  it("filters non-string list values from pros and concerns", () => {
    const result = parseApartmentAnalysisJson(
      JSON.stringify({
        pros: ["Valid pro", 42, null, "Another pro"],
        concerns: ["Valid concern", false],
        bestSuitedFor: "Singles or couples",
      }),
    );

    expect(result).toEqual({
      pros: ["Valid pro", "Another pro"],
      concerns: ["Valid concern"],
      bestSuitedFor: "Singles or couples",
    });
  });
});
