/**
 * Client-side filter state. Field names align with future API query params
 * (maxBudget, minBedrooms, minBathrooms, minSquareFeet, neighborhoods, amenities).
 */
export type ApartmentFiltersState = {
  maxBudget: number;
  /** null = no minimum (any bedroom count) */
  minBedrooms: number | null;
  /** null = no minimum (any bathroom count) */
  minBathrooms: number | null;
  /** null = no minimum (any square footage) */
  minSquareFeet: number | null;
  neighborhoods: string[];
  amenities: string[];
};

export function createDefaultApartmentFilters(
  apartments: { rent: number }[],
): ApartmentFiltersState {
  const maxRent =
    apartments.length > 0
      ? Math.max(...apartments.map((a) => a.rent))
      : 5000;

  return {
    maxBudget: Math.ceil(maxRent / 100) * 100,
    minBedrooms: null,
    minBathrooms: null,
    minSquareFeet: null,
    neighborhoods: [],
    amenities: [],
  };
}
