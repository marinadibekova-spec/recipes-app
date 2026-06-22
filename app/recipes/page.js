import prisma from "@/lib/prisma";
import RecipeFilters from "@/components/RecipeFilters";
import RecipeCard from "@/components/RecipeCard";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";

export default async function RecipesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams?.search?.trim();
  const category = resolvedSearchParams?.category?.trim();
  const favorite = resolvedSearchParams?.favorite;

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

  const recipes = await prisma.recipe.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          title="Recipes"
          description="Browse and manage your recipe collection."
          actionLabel="+ Add Recipe"
          actionHref="/recipes/new"
        />

        <RecipeFilters />

        {recipes.length === 0 ? (
          <EmptyState
            title="No recipes found"
            description="Try changing your filters or add a new recipe."
            actionLabel="Add Recipe"
            actionHref="/recipes/new"
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}