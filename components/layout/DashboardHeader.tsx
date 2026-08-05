import Link from "next/link";

const navItems = [
  { href: "/", label: "Search" },
  { href: "/compare", label: "Compare" },
] as const;

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-semibold text-white"
            aria-hidden
          >
            AI
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-zinc-900">
              Apartment Finder
            </p>
            <p className="hidden text-xs text-zinc-500 sm:block">
              AI-powered search & compare
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Main">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
