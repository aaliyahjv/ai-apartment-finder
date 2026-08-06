"use client";

import { useMemo, useState } from "react";
import { ApartmentFilters } from "@/components/apartments/ApartmentFilters";
import { ApartmentGrid } from "@/components/apartments/ApartmentGrid";
import { ComparePanel } from "@/components/apartments/ComparePanel";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { mockApartments } from "@/data/mock-apartments";
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

export default function Home() {
  const budgetMax = useMemo(
    () =>
      mockApartments.length > 0
        ? Math.ceil(
            Math.max(...mockApartments.map((a) => a.rent)) / 100,
          ) * 100
        : 5000,
    [],
  );

  const [filters, setFilters] = useState<ApartmentFiltersState>(() =>
    createDefaultApartmentFilters(mockApartments),
  );

  const neighborhoodOptions = useMemo(
    () => uniqueSorted(mockApartments.map((a) => a.neighborhood)),
    [],
  );

  const amenityOptions = useMemo(
    () => uniqueSorted(mockApartments.flatMap((a) => a.amenities)),
    [],
  );

  const filteredApartments = useMemo(
    () => filterApartments(mockApartments, filters),
    [filters],
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
  } = useCompareSelection(mockApartments);

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
        value={filters}
        onChange={setFilters}
        neighborhoodOptions={neighborhoodOptions}
        amenityOptions={amenityOptions}
        budgetMax={budgetMax}
      />

      <div className="grid flex-1 gap-6 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-3">
          <ApartmentGrid
            apartments={filteredApartments}
            isCompareSelected={isCompareSelected}
            isCompareDisabled={isCompareDisabled}
            onToggleCompare={toggleCompare}
          />
        </div>
        <SectionPlaceholder
          title="Map"
          description="Interactive Google Maps view coming in a later phase."
          className="lg:col-span-2 min-h-[320px] lg:min-h-[480px]"
        />
      </div>

      <ComparePanel
        selectedApartments={selectedApartments}
        onRemove={removeFromCompare}
        onClear={clearCompare}
        comparisonOpen={comparisonOpen}
        onOpenComparison={() => setComparisonOpen(true)}
        onCloseComparison={() => setComparisonOpen(false)}
      />
    </DashboardShell>
  );
}
