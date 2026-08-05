import type { Apartment } from "@/types/apartment";

type ApartmentCardProps = {
  apartment: Apartment;
};

function formatRent(rent: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rent);
}

function formatBedBath(bedrooms: number, bathrooms: number) {
  const bedLabel = bedrooms === 0 ? "Studio" : `${bedrooms} bed`;
  const bathLabel = bathrooms === 1 ? "1 bath" : `${bathrooms} baths`;
  return `${bedLabel} · ${bathLabel}`;
}

const MAX_VISIBLE_AMENITIES = 3;

export function ApartmentCard({ apartment }: ApartmentCardProps) {
  const visibleAmenities = apartment.amenities.slice(0, MAX_VISIBLE_AMENITIES);
  const hiddenAmenityCount =
    apartment.amenities.length - visibleAmenities.length;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] w-full bg-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={apartment.image}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-lg font-semibold tracking-tight text-zinc-900">
            {formatRent(apartment.rent)}
            <span className="text-sm font-normal text-zinc-500"> /mo</span>
          </p>
          <h3 className="mt-1 text-sm font-medium text-zinc-900">
            {apartment.title}
          </h3>
          <p className="mt-0.5 text-sm text-zinc-500">
            {formatBedBath(apartment.bedrooms, apartment.bathrooms)} ·{" "}
            {apartment.squareFeet.toLocaleString()} sq ft
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            {apartment.neighborhood}, {apartment.city}
          </p>
        </div>

        {visibleAmenities.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Amenities">
            {visibleAmenities.map((amenity) => (
              <li
                key={amenity}
                className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700"
              >
                {amenity}
              </li>
            ))}
            {hiddenAmenityCount > 0 ? (
              <li className="rounded-md px-2 py-0.5 text-xs font-medium text-zinc-500">
                +{hiddenAmenityCount} more
              </li>
            ) : null}
          </ul>
        ) : null}

        <p className="line-clamp-2 text-sm text-zinc-600">
          {apartment.description}
        </p>

        <button
          type="button"
          disabled
          className="mt-auto w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-500"
          aria-describedby={`ai-placeholder-${apartment.id}`}
        >
          AI analysis (coming soon)
        </button>
        <span id={`ai-placeholder-${apartment.id}`} className="sr-only">
          AI-powered listing insights will be available in a future release.
        </span>
      </div>
    </article>
  );
}
