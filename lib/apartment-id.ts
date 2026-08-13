const APARTMENT_ID_PATTERN = /^[a-z0-9-]+$/i;
const MAX_APARTMENT_ID_LENGTH = 64;

export function isValidApartmentId(id: string): boolean {
  return (
    id.length > 0 &&
    id.length <= MAX_APARTMENT_ID_LENGTH &&
    APARTMENT_ID_PATTERN.test(id)
  );
}
