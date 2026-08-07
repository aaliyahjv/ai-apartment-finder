import type { Apartment } from "@/types/apartment";
import { ApartmentCard } from "@/components/apartments/ApartmentCard";

type ApartmentGridProps = {
  apartments: Apartment[];
  emptyMessage?: string;
  isCompareSelected?: (apartmentId: string) => boolean;
  isCompareDisabled?: (apartmentId: string) => boolean;
  onToggleCompare?: (apartmentId: string) => void;
};

export function ApartmentGrid({
  apartments,
  emptyMessage = "No apartments match your filters. Try adjusting your search.",
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
      {apartments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-sm font-medium text-zinc-900">No listings to show</p>
          <p className="mt-2 text-sm text-zinc-500">{emptyMessage}</p>
        </div>
      ) : (
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
      )}
    </section>
  );
}
