import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";
import FavoriteRecipeButton from "@/components/FavoriteRecipeButton";

const parseJsonArray = (value) => {
  try {
    const parsedValue = JSON.parse(value);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

export default async function RecipeDetailsPage({ params }) {
  const { id } = await params;
  const recipeId = Number(id);

  if (Number.isNaN(recipeId)) {
    notFound();
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    notFound();
  }

  const ingredients = parseJsonArray(recipe.ingredients);
  const instructions = parseJsonArray(recipe.instructions);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <PageHeader
          title={recipe.title}
          description="View recipe details, ingredients and instructions."
          actionLabel="Back to Recipes"
          actionHref="/recipes"
        />

        <div className="flex flex-wrap items-center gap-3">
          <FavoriteRecipeButton
            recipeId={recipe.id}
            initialValue={recipe.isFavorite}
          />

          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Edit Recipe
          </Link>

          <DeleteRecipeButton recipeId={recipe.id} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
              {recipe.imageUrl ? (
  <div className="relative h-72 w-full sm:h-96">
    <Image
      src={recipe.imageUrl}
      alt={recipe.title}
      fill
      className="object-cover"
      sizes="(min-width: 1024px) 800px, 100vw"
    />
  </div>
) : (
  <div className="flex h-72 w-full flex-col items-center justify-center gap-3 bg-slate-100 text-slate-400 sm:h-96">
    <span className="text-6xl">🍽️</span>
    <span className="text-sm font-medium">No image available</span>
  </div>
)}

              <div className="space-y-6 p-6 sm:p-8">
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                        Recipe Summary
                      </h2>

                      <p className="mt-3 text-base leading-7 text-slate-600">
                        {recipe.description ||
                          "No description provided for this recipe yet."}
                      </p>
                    </div>

                    {recipe.category ? (
                      <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                        {recipe.category}
                      </span>
                    ) : null}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Preparation Time
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {recipe.preparationTime
                          ? `${recipe.preparationTime} minutes`
                          : "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Servings
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        {recipe.servings
                          ? `${recipe.servings} servings`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Instructions
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {instructions.length} steps
                </span>
              </div>

              {instructions.length > 0 ? (
                <ol className="space-y-4">
                  {instructions.map((step, index) => (
                    <li
                      key={`${index}-${step}`}
                      className="flex gap-4 rounded-2xl bg-slate-50 p-4"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <p className="pt-1 text-sm leading-6 text-slate-700">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-slate-500">
                  No instructions are available for this recipe.
                </p>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Ingredients
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {ingredients.length} items
                </span>
              </div>

              {ingredients.length > 0 ? (
                <ul className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <li
                      key={`${index}-${ingredient}`}
                      className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
                    >
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500" />
                      <p className="text-sm leading-6 text-slate-700">
                        {ingredient}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">
                  No ingredients are available for this recipe.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
