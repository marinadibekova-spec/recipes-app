import Link from "next/link";
import { RECIPE_CATEGORIES } from "@/lib/categories";

export default function RecipeFilters({ searchParams = {} }) {
  const search = searchParams?.search || "";
  const category = searchParams?.category || "";
  const sort = searchParams?.sort || "newest";
  const favorite = searchParams?.favorite === "true";

  return (
    <form
      action="/recipes"
      method="GET"
      className="rounded-3xl bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-end">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Search
          </label>
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search recipes..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            name="category"
            defaultValue={category}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All categories</option>
            {RECIPE_CATEGORIES.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Sort
          </label>
          <select
            name="sort"
            defaultValue={sort}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="favorites">Favorites first</option>
            <option value="prepTime">Preparation time</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Apply Filter
          </button>

          <Link
            href="/recipes"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Clear
          </Link>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          id="favorite"
          name="favorite"
          type="checkbox"
          value="true"
          defaultChecked={favorite}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600"
        />
        <label htmlFor="favorite" className="text-sm text-slate-700">
          Favorites only
        </label>
      </div>
    </form>
  );
}