import type { Apartment } from "@/types/apartment";
import { ApartmentCard } from "@/components/apartments/ApartmentCard";

type ApartmentGridProps = {
  apartments: Apartment[];
  isCompareSelected?: (apartmentId: string) => boolean;
  isCompareDisabled?: (apartmentId: string) => boolean;
  onToggleCompare?: (apartmentId: string) => void;
};

export function ApartmentGrid({
  apartments,
  isCompareSelected,
  isCompareDisabled,
  onToggleCompare,
}: ApartmentGridProps) {
  const compareEnabled = Boolean(onToggleCompare && isCompareSelected);
  return (
    <section aria-label="Apartment listings">
      <p className="mb-4 text-sm text-zinc-500">
        {apartments.length} listing{apartments.length === 1 ? "" : "s"} in the
        Seattle area
      </p>
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {apartments.map((apartment) => (
          <li key={apartment.id}>
            <ApartmentCard
              apartment={apartment}
              compareSelected={
                compareEnabled ? isCompareSelected!(apartment.id) : undefined
              }
              compareDisabled={
                compareEnabled ? isCompareDisabled?.(apartment.id) : undefined
              }
              onToggleCompare={
                compareEnabled
                  ? () => onToggleCompare!(apartment.id)
                  : undefined
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
