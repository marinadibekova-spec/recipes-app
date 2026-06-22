import Link from "next/link";
import prisma from "@/lib/prisma";
import RecipeFilters from "@/components/RecipeFilters";
import RecipeCard from "@/components/RecipeCard";

export default async function RecipesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const favorite = resolvedSearchParams?.favorite;

  const search = resolvedSearchParams?.search?.trim();
  const category = resolvedSearchParams?.category?.trim();

  // Build filters from URL query params
  const where = {
  ...(category ? { category } : {}),
  ...(favorite === "true" ? { isFavorite: true } : {}),
  ...(search
    ? {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }
    : {}),
};

  // Fetch filtered recipes from database
  const recipes = await prisma.recipe.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Recipes</h1>
            <p className="mt-1 text-sm text-slate-500">
              Browse and manage your recipe collection.
            </p>
          </div>

          <Link
            href="/recipes/new"
            className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
          >
            + Add Recipe
          </Link>
        </div>

        {/* Search and category filters */}
        <RecipeFilters />

        {/* Empty state */}
        {recipes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-medium text-slate-900">
              No recipes found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Try changing your filters or add a new recipe.
            </p>

            <div className="mt-6">
              <Link
                href="/recipes/new"
                className="inline-flex items-center rounded-2xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Add Recipe
              </Link>
            </div>
          </div>
        ) : (
          // Recipe card grid
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}