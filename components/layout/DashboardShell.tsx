import type { ReactNode } from "react";

type DashboardShellProps = {
  header: ReactNode;
  children: ReactNode;
};

export function DashboardShell({ header, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
      {header}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
