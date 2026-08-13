export type ApartmentAnalysis = {
  pros: string[];
  concerns: string[];
  bestSuitedFor: string;
};

export type ApartmentAnalysisApiResponse = {
  analysis: ApartmentAnalysis;
};
