import { describe, expect, it } from "vitest";
import { filterApartments } from "@/lib/filter-apartments";
import {
  createFilters,
  familyApartment,
  loftApartment,
  studioApartment,
  testApartments,
} from "@/tests/fixtures/apartments";

describe("filterApartments", () => {
  it("returns all apartments when filters are wide open", () => {
    expect(filterApartments(testApartments, createFilters())).toHaveLength(3);
  });

  it("filters by max budget", () => {
    const result = filterApartments(
      testApartments,
      createFilters({ maxBudget: 2000 }),
    );

    expect(result).toEqual([studioApartment]);
  });

  it("filters by minimum bedrooms", () => {
    const result = filterApartments(
      testApartments,
      createFilters({ minBedrooms: 2 }),
    );

    expect(result).toEqual([familyApartment, loftApartment]);
  });

  it("filters by minimum bathrooms", () => {
    const result = filterApartments(
      testApartments,
      createFilters({ minBathrooms: 2 }),
    );

    expect(result).toEqual([familyApartment, loftApartment]);
  });

  it("filters by minimum square footage", () => {
    const result = filterApartments(
      testApartments,
      createFilters({ minSquareFeet: 1000 }),
    );

    expect(result).toEqual([familyApartment, loftApartment]);
  });

  it("filters by neighborhood", () => {
    const result = filterApartments(
      testApartments,
      createFilters({ neighborhoods: ["Ballard"] }),
    );

    expect(result).toEqual([familyApartment]);
  });

  it("requires all selected amenities", () => {
    const result = filterApartments(
      testApartments,
      createFilters({ amenities: ["Parking", "AC"] }),
    );

    expect(result).toEqual([studioApartment]);
  });

  it("applies combined filters together", () => {
    const result = filterApartments(
      testApartments,
      createFilters({
        maxBudget: 3500,
        minBedrooms: 2,
        minBathrooms: 2,
        minSquareFeet: 1000,
        neighborhoods: ["Capitol Hill"],
        amenities: ["Roof deck"],
      }),
    );

    expect(result).toEqual([loftApartment]);
  });

  it("returns an empty array when no apartments match", () => {
    const result = filterApartments(
      testApartments,
      createFilters({
        maxBudget: 1500,
        minBedrooms: 4,
        neighborhoods: ["Queen Anne"],
        amenities: ["Sauna"],
      }),
    );

    expect(result).toEqual([]);
  });

  it("returns an empty array when filtering an empty input list", () => {
    expect(
      filterApartments([], createFilters({ neighborhoods: ["Ballard"] })),
    ).toEqual([]);
  });
});
