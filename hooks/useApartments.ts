"use client";

import { useCallback, useEffect, useState } from "react";
import type { Apartment } from "@/types/apartment";

type UseApartmentsResult = {
  apartments: Apartment[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useApartments(): UseApartmentsResult {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadApartments() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/apartments");
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        if (!cancelled) {
          setApartments(data as Apartment[]);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setApartments([]);
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load apartments",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadApartments();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  return { apartments, loading, error, refetch };
}
