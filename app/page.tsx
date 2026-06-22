import Link from "next/link";
import prisma from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";

export default async function HomePage() {
  // Dashboard statistics
  const totalRecipes = await prisma.recipe.count();

  const favoriteRecipes = await prisma.recipe.count({
    where: {
      isFavorite: true,
    },
  });

  const categories = await prisma.recipe.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
    where: {
      category: {
        not: null,
      },
    },
  });

  const latestRecipe = await prisma.recipe.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          title="Recipe Dashboard"
          description="Overview of your recipe collection."
          actionLabel="View Recipes"
          actionHref="/recipes"
        />

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Recipes</p>
            <h2 className="mt-2 text-4xl font-bold text-slate-900">
              {totalRecipes}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Favorite Recipes</p>
            <h2 className="mt-2 text-4xl font-bold text-amber-500">
              {favoriteRecipes}
            </h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Categories</p>
            <h2 className="mt-2 text-4xl font-bold text-indigo-600">
              {categories.length}
            </h2>
          </div>
        </div>

        {/* Latest Recipe */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Latest Recipe
          </h2>

          {latestRecipe ? (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-slate-900">
                {latestRecipe.title}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {latestRecipe.description || "No description provided."}
              </p>

              <Link
                href={`/recipes/${latestRecipe.id}`}
                className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:underline"
              >
                View Recipe →
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No recipes available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
