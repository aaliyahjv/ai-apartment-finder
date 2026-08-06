"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ComparePanel } from "@/components/apartments/ComparePanel";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { mockApartments } from "@/data/mock-apartments";
import { useCompareSelection } from "@/hooks/useCompareSelection";

export default function ComparePage() {
  const {
    selectedApartments,
    comparisonOpen,
    setComparisonOpen,
    removeFromCompare,
    clearCompare,
  } = useCompareSelection(mockApartments);

  useEffect(() => {
    if (selectedApartments.length >= 2) {
      setComparisonOpen(true);
    }
  }, [selectedApartments.length, setComparisonOpen]);

  return (
    <DashboardShell header={<DashboardHeader />}>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Compare apartments
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600">
          Review rent, size, location, and amenities side by side for up to three
          listings.
        </p>
      </div>

      {selectedApartments.length === 0 ? (
        <section className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-zinc-900">
            No apartments selected yet
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Use <span className="font-medium text-zinc-700">Add to compare</span>{" "}
            on the search page, then return here for a full comparison view.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Back to search
          </Link>
        </section>
      ) : (
        <ComparePanel
          selectedApartments={selectedApartments}
          onRemove={removeFromCompare}
          onClear={clearCompare}
          comparisonOpen={comparisonOpen}
          onOpenComparison={() => setComparisonOpen(true)}
          onCloseComparison={() => setComparisonOpen(false)}
          showComparePageLink={false}
        />
      )}
    </DashboardShell>
  );
}
