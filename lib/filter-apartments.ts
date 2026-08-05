import type { Apartment } from "@/types/apartment";
import type { ApartmentFiltersState } from "@/types/apartment-filters";

export function filterApartments(
  apartments: Apartment[],
  filters: ApartmentFiltersState,
): Apartment[] {
  return apartments.filter((apartment) => {
    if (apartment.rent > filters.maxBudget) {
      return false;
    }

    if (
      filters.minBedrooms !== null &&
      apartment.bedrooms < filters.minBedrooms
    ) {
      return false;
    }

    if (
      filters.minBathrooms !== null &&
      apartment.bathrooms < filters.minBathrooms
    ) {
      return false;
    }

    if (
      filters.minSquareFeet !== null &&
      apartment.squareFeet < filters.minSquareFeet
    ) {
      return false;
    }

    if (
      filters.neighborhoods.length > 0 &&
      !filters.neighborhoods.includes(apartment.neighborhood)
    ) {
      return false;
    }

    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity) =>
        apartment.amenities.includes(amenity),
      );
      if (!hasAllAmenities) {
        return false;
      }
    }

    return true;
  });
}
