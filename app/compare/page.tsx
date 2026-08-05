import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function ComparePage() {
  return (
    <DashboardShell header={<DashboardHeader />}>
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-zinc-900">
          Apartment comparison
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Side-by-side comparison view will be added in a later task.
        </p>
      </div>
    </DashboardShell>
  );
}
