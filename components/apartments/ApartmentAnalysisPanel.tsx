"use client";

import { useApartmentAnalysis } from "@/hooks/useApartmentAnalysis";

type ApartmentAnalysisPanelProps = {
  apartmentId: string;
};

function AnalysisList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </h4>
      <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-zinc-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ApartmentAnalysisPanel({
  apartmentId,
}: ApartmentAnalysisPanelProps) {
  const { state, analyze, retry } = useApartmentAnalysis(apartmentId);

  const isLoading = state.status === "loading";
  const hasAnalysis = state.status === "success" && state.analysis !== null;

  return (
    <div className="flex flex-col gap-2">
      {!hasAnalysis ? (
        <button
          type="button"
          onClick={() => void analyze()}
          disabled={isLoading}
          className="w-full rounded-lg border border-zinc-900 bg-white px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Analyzing…" : "Analyze with AI"}
        </button>
      ) : null}

      {isLoading ? (
        <div
          aria-live="polite"
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600"
        >
          Generating a concise assessment from this listing&apos;s data…
        </div>
      ) : null}

      {state.status === "error" ? (
        <div
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2"
        >
          <p className="text-sm font-medium text-red-900">
            Could not generate analysis
          </p>
          <p className="mt-1 text-sm text-red-800">{state.error}</p>
          <button
            type="button"
            onClick={() => void retry()}
            className="mt-2 text-sm font-medium text-red-900 underline underline-offset-2 hover:text-red-700"
          >
            Try again
          </button>
        </div>
      ) : null}

      {hasAnalysis ? (
        <section
          aria-label="AI apartment analysis"
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            AI analysis
          </p>
          <div className="mt-3 space-y-3">
            <AnalysisList title="Pros" items={state.analysis!.pros} />
            <AnalysisList title="Potential concerns" items={state.analysis!.concerns} />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Best suited for
              </h4>
              <p className="mt-1.5 text-sm text-zinc-700">
                {state.analysis!.bestSuitedFor}
              </p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
