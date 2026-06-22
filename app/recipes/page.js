import prisma from "@/lib/prisma";
import RecipeFilters from "@/components/RecipeFilters";
import RecipeCard from "@/components/RecipeCard";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";

const RECIPES_PER_PAGE = 6;

function getRecipeOrderBy(sort) {
  if (sort === "oldest") {
    return { createdAt: "asc" };
  }

  if (sort === "favorites") {
    return [{ isFavorite: "desc" }, { createdAt: "desc" }];
  }

  if (sort === "prepTime") {
    return [{ preparationTime: "asc" }, { createdAt: "desc" }];
  }

  return { createdAt: "desc" };
}

function buildPageHref(searchParams, page) {
  const params = new URLSearchParams(searchParams);

  if (page <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(page));
  }

  const queryString = params.toString();

  return queryString ? `/recipes?${queryString}` : "/recipes";
}

export default async function RecipesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams?.search?.trim();
  const category = resolvedSearchParams?.category?.trim();
  const favorite = resolvedSearchParams?.favorite;
  const sort = resolvedSearchParams?.sort || "newest";

  const currentPage = Math.max(Number(resolvedSearchParams?.page || 1), 1);
  const skip = (currentPage - 1) * RECIPES_PER_PAGE;

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

  const totalRecipes = await prisma.recipe.count({ where });

  const recipes = await prisma.recipe.findMany({
    where,
    skip,
    take: RECIPES_PER_PAGE,
    orderBy: getRecipeOrderBy(sort),
  });

  const totalPages = Math.ceil(totalRecipes / RECIPES_PER_PAGE);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

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
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              {hasPreviousPage ? (
                <a
                  href={buildPageHref(resolvedSearchParams, currentPage - 1)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Previous
                </a>
              ) : (
                <span className="rounded-full border border-slate-100 bg-slate-100 px-4 py-2 text-sm text-slate-400">
                  Previous
                </span>
              )}

              <span className="text-sm text-slate-500">
                Page {currentPage} of {totalPages || 1}
              </span>

              {hasNextPage ? (
                <a
                  href={buildPageHref(resolvedSearchParams, currentPage + 1)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Next
                </a>
              ) : (
                <span className="rounded-full border border-slate-100 bg-slate-100 px-4 py-2 text-sm text-slate-400">
                  Next
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}