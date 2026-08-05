"use client";

import type { ApartmentFiltersState } from "@/types/apartment-filters";

type ApartmentFiltersProps = {
  value: ApartmentFiltersState;
  onChange: (value: ApartmentFiltersState) => void;
  neighborhoodOptions: string[];
  amenityOptions: string[];
  budgetMin?: number;
  budgetMax?: number;
};

const BEDROOM_OPTIONS: { label: string; value: number | null }[] = [
  { label: "Any", value: null },
  { label: "Studio", value: 0 },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
];

const BATHROOM_OPTIONS: { label: string; value: number | null }[] = [
  { label: "Any", value: null },
  { label: "1+ bathroom", value: 1 },
  { label: "1.5+ bathrooms", value: 1.5 },
  { label: "2+ bathrooms", value: 2 },
  { label: "3+ bathrooms", value: 3 },
];

const SQUARE_FEET_OPTIONS: { label: string; value: number | null }[] = [
  { label: "Any", value: null },
  { label: "500+ sq ft", value: 500 },
  { label: "750+ sq ft", value: 750 },
  { label: "1000+ sq ft", value: 1000 },
  { label: "1250+ sq ft", value: 1250 },
];

function parseOptionalNumber(raw: string): number | null {
  if (raw === "") {
    return null;
  }
  const parsed = Number.parseFloat(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

function formatSelectValue(value: number | null) {
  return value === null ? "" : String(value);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function toggleInList(list: string[], item: string) {
  return list.includes(item)
    ? list.filter((entry) => entry !== item)
    : [...list, item];
}

export function ApartmentFilters({
  value,
  onChange,
  neighborhoodOptions,
  amenityOptions,
  budgetMin = 1000,
  budgetMax = 5000,
}: ApartmentFiltersProps) {
  const budgetStep = 50;

  function patch(partial: Partial<ApartmentFiltersState>) {
    onChange({ ...value, ...partial });
  }

  function handleBudgetSlider(next: number) {
    patch({ maxBudget: Math.min(budgetMax, Math.max(budgetMin, next)) });
  }

  function handleBudgetInput(raw: string) {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      return;
    }
    handleBudgetSlider(parsed);
  }

  const hasActiveFilters =
    value.minBedrooms !== null ||
    value.minBathrooms !== null ||
    value.minSquareFeet !== null ||
    value.neighborhoods.length > 0 ||
    value.amenities.length > 0 ||
    value.maxBudget < budgetMax;

  return (
    <section
      className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      aria-label="Search filters"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Search filters</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Narrow listings by budget, size, area, and amenities.
          </p>
        </div>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={() =>
              onChange({
                maxBudget: budgetMax,
                minBedrooms: null,
                minBathrooms: null,
                minSquareFeet: null,
                neighborhoods: [],
                amenities: [],
              })
            }
            className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <div className="lg:col-span-2 xl:col-span-1">
          <label
            htmlFor="filter-max-budget"
            className="text-sm font-medium text-zinc-900"
          >
            Maximum budget
          </label>
          <p className="mt-0.5 text-sm text-zinc-500">
            Up to {formatCurrency(value.maxBudget)} /mo
          </p>
          <input
            id="filter-max-budget"
            type="range"
            min={budgetMin}
            max={budgetMax}
            step={budgetStep}
            value={value.maxBudget}
            onChange={(e) => handleBudgetSlider(Number(e.target.value))}
            className="mt-3 w-full accent-zinc-900"
          />
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-zinc-500">$</span>
            <input
              type="number"
              min={budgetMin}
              max={budgetMax}
              step={budgetStep}
              value={value.maxBudget}
              onChange={(e) => handleBudgetInput(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10"
              aria-label="Maximum budget in dollars per month"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="filter-min-bedrooms"
            className="text-sm font-medium text-zinc-900"
          >
            Minimum bedrooms
          </label>
          <select
            id="filter-min-bedrooms"
            value={formatSelectValue(value.minBedrooms)}
            onChange={(e) =>
              patch({ minBedrooms: parseOptionalNumber(e.target.value) })
            }
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10"
          >
            {BEDROOM_OPTIONS.map(({ label, value: bedValue }) => (
              <option key={label} value={formatSelectValue(bedValue)}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-min-bathrooms"
            className="text-sm font-medium text-zinc-900"
          >
            Minimum bathrooms
          </label>
          <select
            id="filter-min-bathrooms"
            value={formatSelectValue(value.minBathrooms)}
            onChange={(e) =>
              patch({ minBathrooms: parseOptionalNumber(e.target.value) })
            }
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10"
          >
            {BATHROOM_OPTIONS.map(({ label, value: bathValue }) => (
              <option key={label} value={formatSelectValue(bathValue)}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-min-square-feet"
            className="text-sm font-medium text-zinc-900"
          >
            Minimum square footage
          </label>
          <select
            id="filter-min-square-feet"
            value={formatSelectValue(value.minSquareFeet)}
            onChange={(e) =>
              patch({ minSquareFeet: parseOptionalNumber(e.target.value) })
            }
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10"
          >
            {SQUARE_FEET_OPTIONS.map(({ label, value: sqftValue }) => (
              <option key={label} value={formatSelectValue(sqftValue)}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="min-w-0 lg:col-span-2 xl:col-span-4">
          <legend className="text-sm font-medium text-zinc-900">
            Neighborhood
          </legend>
          <p className="mt-0.5 text-sm text-zinc-500">
            Leave unchecked to include all areas.
          </p>
          <ul className="mt-3 flex max-h-36 flex-wrap gap-2 overflow-y-auto">
            {neighborhoodOptions.map((neighborhood) => {
              const checked = value.neighborhoods.includes(neighborhood);
              return (
                <li key={neighborhood}>
                  <label
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      checked
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() =>
                        patch({
                          neighborhoods: toggleInList(
                            value.neighborhoods,
                            neighborhood,
                          ),
                        })
                      }
                    />
                    {neighborhood}
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <fieldset className="min-w-0 lg:col-span-2 xl:col-span-4">
          <legend className="text-sm font-medium text-zinc-900">
            Amenities
          </legend>
          <p className="mt-0.5 text-sm text-zinc-500">
            Listings must include every amenity you select.
          </p>
          <ul className="mt-3 flex max-h-36 flex-wrap gap-2 overflow-y-auto">
            {amenityOptions.map((amenity) => {
              const checked = value.amenities.includes(amenity);
              return (
                <li key={amenity}>
                  <label
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      checked
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() =>
                        patch({
                          amenities: toggleInList(value.amenities, amenity),
                        })
                      }
                    />
                    {amenity}
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </div>
    </section>
  );
}
