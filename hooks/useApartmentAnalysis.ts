"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { ApartmentAnalysis } from "@/types/apartment-analysis";

type AnalysisStatus = "idle" | "loading" | "success" | "error";

type AnalysisState = {
  status: AnalysisStatus;
  analysis: ApartmentAnalysis | null;
  error: string | null;
};

const IDLE_STATE: AnalysisState = {
  status: "idle",
  analysis: null,
  error: null,
};

const analysisCache = new Map<string, AnalysisState>();
const analysisListeners = new Set<() => void>();

function notifyAnalysisListeners() {
  analysisListeners.forEach((listener) => listener());
}

function subscribeAnalysis(listener: () => void) {
  analysisListeners.add(listener);
  return () => {
    analysisListeners.delete(listener);
  };
}

function getAnalysisSnapshot(apartmentId: string): AnalysisState {
  return analysisCache.get(apartmentId) ?? IDLE_STATE;
}

function getAnalysisServerSnapshot(): AnalysisState {
  return IDLE_STATE;
}

function setAnalysisState(apartmentId: string, nextState: AnalysisState) {
  analysisCache.set(apartmentId, nextState);
  notifyAnalysisListeners();
}

export function useApartmentAnalysis(apartmentId: string) {
  const state = useSyncExternalStore(
    subscribeAnalysis,
    () => getAnalysisSnapshot(apartmentId),
    getAnalysisServerSnapshot,
  );

  const analyze = useCallback(async () => {
    const existing = analysisCache.get(apartmentId);
    if (existing?.status === "success" || existing?.status === "loading") {
      return;
    }

    setAnalysisState(apartmentId, {
      status: "loading",
      analysis: null,
      error: null,
    });

    try {
      const response = await fetch(`/api/apartments/${apartmentId}/analyze`, {
        method: "POST",
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Failed to generate analysis";
        throw new Error(message);
      }

      if (
        typeof data !== "object" ||
        data === null ||
        !("analysis" in data) ||
        typeof data.analysis !== "object" ||
        data.analysis === null
      ) {
        throw new Error("Invalid analysis response");
      }

      setAnalysisState(apartmentId, {
        status: "success",
        analysis: data.analysis as ApartmentAnalysis,
        error: null,
      });
    } catch (fetchError) {
      setAnalysisState(apartmentId, {
        status: "error",
        analysis: null,
        error:
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to generate analysis",
      });
    }
  }, [apartmentId]);

  const retry = useCallback(async () => {
    analysisCache.delete(apartmentId);
    notifyAnalysisListeners();
    await analyze();
  }, [analyze, apartmentId]);

  return { state, analyze, retry };
}
