import { ApartmentGrid } from "@/components/apartments/ApartmentGrid";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { mockApartments } from "@/data/mock-apartments";

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

export default function Home() {
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

      <SectionPlaceholder
        title="Search filters"
        description="Budget, location, beds, baths, and amenities will appear here."
      />

      <div className="grid flex-1 gap-6 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-3">
          <ApartmentGrid apartments={mockApartments} />
        </div>
        <SectionPlaceholder
          title="Map"
          description="Interactive Google Maps view coming in a later phase."
          className="lg:col-span-2 min-h-[320px] lg:min-h-[480px]"
        />
      </div>
    </DashboardShell>
  );
}
