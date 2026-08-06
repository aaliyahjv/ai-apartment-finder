"use client";

import Link from "next/link";
import type { Apartment } from "@/types/apartment";
import { MAX_COMPARE_APARTMENTS } from "@/types/compare";

type ComparePanelProps = {
  selectedApartments: Apartment[];
  onRemove: (apartmentId: string) => void;
  onClear: () => void;
  comparisonOpen: boolean;
  onOpenComparison: () => void;
  onCloseComparison: () => void;
  showComparePageLink?: boolean;
};

function formatRent(rent: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rent);
}

function formatBedrooms(bedrooms: number) {
  return bedrooms === 0 ? "Studio" : String(bedrooms);
}

type CompareRow = {
  label: string;
  values: string[];
};

function buildCompareRows(apartments: Apartment[]): CompareRow[] {
  return [
    {
      label: "Rent",
      values: apartments.map((a) => `${formatRent(a.rent)} /mo`),
    },
    {
      label: "Bedrooms",
      values: apartments.map((a) => formatBedrooms(a.bedrooms)),
    },
    {
      label: "Bathrooms",
      values: apartments.map((a) => String(a.bathrooms)),
    },
    {
      label: "Square footage",
      values: apartments.map((a) => `${a.squareFeet.toLocaleString()} sq ft`),
    },
    {
      label: "Neighborhood",
      values: apartments.map((a) => `${a.neighborhood}, ${a.city}`),
    },
    {
      label: "Amenities",
      values: apartments.map((a) =>
        a.amenities.length > 0 ? a.amenities.join(", ") : "—",
      ),
    },
  ];
}

export function ComparePanel({
  selectedApartments,
  onRemove,
  onClear,
  comparisonOpen,
  onOpenComparison,
  onCloseComparison,
  showComparePageLink = true,
}: ComparePanelProps) {
  if (selectedApartments.length === 0) {
    return null;
  }

  const canCompare = selectedApartments.length >= 2;
  const compareRows = buildCompareRows(selectedApartments);

  return (
    <div className="flex flex-col gap-4">
      {comparisonOpen && canCompare ? (
        <section
          className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
          aria-label="Apartment comparison table"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-6 py-4">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                Side-by-side comparison
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                Comparing {selectedApartments.length} listings
              </p>
            </div>
            <button
              type="button"
              onClick={onCloseComparison}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              Close table
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th
                    scope="col"
                    className="px-4 py-3 font-medium text-zinc-500"
                  >
                    Detail
                  </th>
                  {selectedApartments.map((apartment) => (
                    <th
                      key={apartment.id}
                      scope="col"
                      className="px-4 py-3 font-medium text-zinc-900"
                    >
                      <span className="block">{apartment.title}</span>
                      <span className="mt-0.5 block text-xs font-normal text-zinc-500">
                        {apartment.neighborhood}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.label} className="border-b border-zinc-100">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-4 py-3 font-medium text-zinc-700"
                    >
                      {row.label}
                    </th>
                    {row.values.map((value, index) => (
                      <td
                        key={`${row.label}-${selectedApartments[index]?.id ?? index}`}
                        className="px-4 py-3 text-zinc-600 align-top"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <div
        className="sticky bottom-4 z-20 rounded-xl border border-zinc-200 bg-white p-4 shadow-lg ring-1 ring-zinc-900/5"
        role="region"
        aria-label="Compare selection"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900">
              Compare{" "}
              <span className="font-normal text-zinc-500">
                ({selectedApartments.length}/{MAX_COMPARE_APARTMENTS} selected)
              </span>
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {selectedApartments.map((apartment) => (
                <li key={apartment.id}>
                  <span className="inline-flex max-w-full items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 py-1 pl-2.5 pr-1 text-xs font-medium text-zinc-800">
                    <span className="truncate">{apartment.title}</span>
                    <button
                      type="button"
                      onClick={() => onRemove(apartment.id)}
                      className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900"
                      aria-label={`Remove ${apartment.title} from comparison`}
                    >
                      ×
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            {!canCompare ? (
              <p className="mt-2 text-xs text-zinc-500">
                Select at least 2 apartments to compare.
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Clear all
            </button>
            {canCompare ? (
              <>
                <button
                  type="button"
                  onClick={
                    comparisonOpen ? onCloseComparison : onOpenComparison
                  }
                  className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  {comparisonOpen ? "Hide table" : "Compare"}
                </button>
                {showComparePageLink ? (
                  <Link
                    href="/compare"
                    className="rounded-lg border border-zinc-900 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
                  >
                    Open compare page
                  </Link>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

