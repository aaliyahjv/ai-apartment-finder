import type { Apartment } from "@/types/apartment";
import type { ApartmentFiltersState } from "@/types/apartment-filters";

function createApartment(overrides: Partial<Apartment> & Pick<Apartment, "id">): Apartment {
  return {
    title: "Test apartment",
    address: "123 Test St",
    neighborhood: "Fremont",
    city: "Seattle",
    state: "WA",
    zipCode: "98103",
    rent: 2000,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 700,
    amenities: ["Parking"],
    description: "A test listing.",
    image: "https://example.com/image.jpg",
    latitude: 47.65,
    longitude: -122.35,
    ...overrides,
  };
}

export const studioApartment = createApartment({
  id: "apt-studio",
  rent: 1800,
  bedrooms: 0,
  bathrooms: 1,
  squareFeet: 520,
  neighborhood: "Fremont",
  amenities: ["AC", "Parking"],
});

export const familyApartment = createApartment({
  id: "apt-family",
  rent: 3200,
  bedrooms: 3,
  bathrooms: 2,
  squareFeet: 1300,
  neighborhood: "Ballard",
  amenities: ["Parking", "Pool", "Pet friendly"],
});

export const loftApartment = createApartment({
  id: "apt-loft",
  rent: 2900,
  bedrooms: 2,
  bathrooms: 2,
  squareFeet: 1050,
  neighborhood: "Capitol Hill",
  amenities: ["In-unit laundry", "Roof deck"],
});

export const testApartments = [studioApartment, familyApartment, loftApartment];

export function createFilters(
  overrides: Partial<ApartmentFiltersState> = {},
): ApartmentFiltersState {
  return {
    maxBudget: 5000,
    minBedrooms: null,
    minBathrooms: null,
    minSquareFeet: null,
    neighborhoods: [],
    amenities: [],
    ...overrides,
  };
}
