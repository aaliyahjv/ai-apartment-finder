/**
 * Domain type for apartment listings. Field names and shapes mirror the planned
 * Prisma model so API responses and seed data can use this type without UI changes.
 */
export type Apartment = {
  id: string;
  title: string;
  address: string;
  neighborhood: string;
  city: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  amenities: string[];
  description: string;
  image: string;
  latitude: number;
  longitude: number;
};
