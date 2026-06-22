import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        {/* Brand */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
              RM
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">
                Recipe Manager
              </p>
              <p className="text-sm text-slate-500">Create, organize and share recipes</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
          <div className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-900"
            >
              Home
            </Link>
            <Link
              href="/recipes"
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-900"
            >
              Recipes
            </Link>
          </div>

          <Link
            href="/recipes/new"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Add Recipe
          </Link>
        </nav>
      </div>
    </header>
  )
}