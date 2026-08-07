"use client";

import { useMemo, useState } from "react";
import { ApartmentFilters } from "@/components/apartments/ApartmentFilters";
import { ApartmentGrid } from "@/components/apartments/ApartmentGrid";
import { ComparePanel } from "@/components/apartments/ComparePanel";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useApartments } from "@/hooks/useApartments";
import { useCompareSelection } from "@/hooks/useCompareSelection";
import { filterApartments } from "@/lib/filter-apartments";
import {
  createDefaultApartmentFilters,
  type ApartmentFiltersState,
} from "@/types/apartment-filters";

function SectionPlaceholder({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-dashed border-zinc-300 bg-white p-6 shadow-sm ${className ?? ""}`}
      aria-label={title}
    >
      <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
      <div className="mt-4 h-24 rounded-lg bg-zinc-50 ring-1 ring-inset ring-zinc-100" />
    </section>
  );
}

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function ListingsLoadingState() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading apartment listings"
      className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm"
    >
      <p className="text-sm font-medium text-zinc-900">Loading apartments…</p>
      <p className="mt-2 text-sm text-zinc-500">
        Fetching listings from the database.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {[0, 1, 2, 3].map((key) => (
          <div
            key={key}
            className="h-64 animate-pulse rounded-xl bg-zinc-100 ring-1 ring-inset ring-zinc-200/80"
          />
        ))}
      </div>
    </section>
  );
}

function ListingsErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section
      aria-live="polite"
      className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm"
    >
      <p className="text-sm font-medium text-red-900">
        Could not load apartments
      </p>
      <p className="mt-2 text-sm text-red-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-red-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800"
      >
        Try again
      </button>
    </section>
  );
}

export default function Home() {
  const { apartments, loading, error, refetch } = useApartments();
  const [filters, setFilters] = useState<ApartmentFiltersState | null>(null);

  const defaultFilters = useMemo(
    () => createDefaultApartmentFilters(apartments),
    [apartments],
  );

  const activeFilters = filters ?? defaultFilters;

  const budgetMax = useMemo(
    () =>
      apartments.length > 0
        ? Math.ceil(Math.max(...apartments.map((a) => a.rent)) / 100) * 100
        : 5000,
    [apartments],
  );

  const neighborhoodOptions = useMemo(
    () => uniqueSorted(apartments.map((a) => a.neighborhood)),
    [apartments],
  );

  const amenityOptions = useMemo(
    () => uniqueSorted(apartments.flatMap((a) => a.amenities)),
    [apartments],
  );

  const filteredApartments = useMemo(
    () => filterApartments(apartments, activeFilters),
    [apartments, activeFilters],
  );

  const {
    selectedApartments,
    comparisonOpen,
    setComparisonOpen,
    toggleCompare,
    removeFromCompare,
    clearCompare,
    isCompareSelected,
    isCompareDisabled,
  } = useCompareSelection(apartments);

  const gridEmptyMessage =
    apartments.length === 0
      ? "No apartment listings are available right now."
      : "No apartments match your filters. Try adjusting your search.";

  return (
    <DashboardShell header={<DashboardHeader />}>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Find your next apartment
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600">
          Filter listings by budget, location, and lifestyle. Compare options
          and review AI insights before you tour.
        </p>
      </div>

      <ApartmentFilters
        value={activeFilters}
        onChange={setFilters}
        neighborhoodOptions={neighborhoodOptions}
        amenityOptions={amenityOptions}
        budgetMax={budgetMax}
      />

      <div className="grid flex-1 gap-6 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-3">
          {loading ? (
            <ListingsLoadingState />
          ) : error ? (
            <ListingsErrorState message={error} onRetry={refetch} />
          ) : (
            <ApartmentGrid
              apartments={filteredApartments}
              emptyMessage={gridEmptyMessage}
              isCompareSelected={isCompareSelected}
              isCompareDisabled={isCompareDisabled}
              onToggleCompare={toggleCompare}
            />
          )}
        </div>
        <SectionPlaceholder
          title="Map"
          description="Interactive Google Maps view coming in a later phase."
          className="lg:col-span-2 min-h-[320px] lg:min-h-[480px]"
        />
      </div>

      {!loading && !error ? (
        <ComparePanel
          selectedApartments={selectedApartments}
          onRemove={removeFromCompare}
          onClear={clearCompare}
          comparisonOpen={comparisonOpen}
          onOpenComparison={() => setComparisonOpen(true)}
          onCloseComparison={() => setComparisonOpen(false)}
        />
      ) : null}
    </DashboardShell>
  );
}
