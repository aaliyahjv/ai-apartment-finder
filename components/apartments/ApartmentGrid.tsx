import type { Apartment } from "@/types/apartment";
import { ApartmentCard } from "@/components/apartments/ApartmentCard";

type ApartmentGridProps = {
  apartments: Apartment[];
};

export function ApartmentGrid({ apartments }: ApartmentGridProps) {
  return (
    <section aria-label="Apartment listings">
      <p className="mb-4 text-sm text-zinc-500">
        {apartments.length} listing{apartments.length === 1 ? "" : "s"} in the
        Seattle area
      </p>
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {apartments.map((apartment) => (
          <li key={apartment.id}>
            <ApartmentCard apartment={apartment} />
          </li>
        ))}
      </ul>
    </section>
  );
}
