"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import type { Apartment } from "@/types/apartment";
import {
  getCompareSelectionServerSnapshot,
  getCompareSelectionSnapshot,
  MAX_COMPARE_APARTMENTS,
  subscribeCompareSelection,
  updateCompareSelection,
} from "@/types/compare";

export function useCompareSelection(allApartments: Apartment[]) {
  const selectedIds = useSyncExternalStore(
    subscribeCompareSelection,
    getCompareSelectionSnapshot,
    getCompareSelectionServerSnapshot,
  );

  const [comparisonOpen, setComparisonOpen] = useState(false);

  const apartmentsById = useMemo(
    () => new Map(allApartments.map((apartment) => [apartment.id, apartment])),
    [allApartments],
  );

  const selectedApartments = useMemo(
    () =>
      selectedIds
        .map((id) => apartmentsById.get(id))
        .filter((apartment): apartment is Apartment => apartment !== undefined),
    [selectedIds, apartmentsById],
  );

  const toggleCompare = useCallback(
    (apartmentId: string) => {
      if (selectedIds.includes(apartmentId)) {
        const next = selectedIds.filter((id) => id !== apartmentId);
        if (next.length < 2) {
          setComparisonOpen(false);
        }
        updateCompareSelection(next);
        return;
      }
      if (selectedIds.length >= MAX_COMPARE_APARTMENTS) {
        return;
      }
      updateCompareSelection([...selectedIds, apartmentId]);
    },
    [selectedIds],
  );

  const removeFromCompare = useCallback(
    (apartmentId: string) => {
      const next = selectedIds.filter((id) => id !== apartmentId);
      if (next.length < 2) {
        setComparisonOpen(false);
      }
      updateCompareSelection(next);
    },
    [selectedIds],
  );

  const clearCompare = useCallback(() => {
    updateCompareSelection([]);
    setComparisonOpen(false);
  }, []);

  const isCompareSelected = useCallback(
    (apartmentId: string) => selectedIds.includes(apartmentId),
    [selectedIds],
  );

  const isCompareDisabled = useCallback(
    (apartmentId: string) =>
      selectedIds.length >= MAX_COMPARE_APARTMENTS &&
      !selectedIds.includes(apartmentId),
    [selectedIds],
  );

  const effectiveComparisonOpen =
    comparisonOpen && selectedApartments.length >= 2;

  return {
    selectedApartments,
    comparisonOpen: effectiveComparisonOpen,
    setComparisonOpen,
    toggleCompare,
    removeFromCompare,
    clearCompare,
    isCompareSelected,
    isCompareDisabled,
  };
}
