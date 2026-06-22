import Link from 'next/link'
import prisma from '@/lib/prisma'

// Server component to list recipes from the database.
export default async function RecipesPage() {
  // Fetch recipes ordered by createdAt descending.
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header: title + Add button */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Recipes</h1>
            <p className="mt-1 text-sm text-slate-500">Browse and manage your recipe collection.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/recipes/new"
              className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
            >
              + Add Recipe
            </Link>
          </div>
        </div>

        {/* Empty state */}
        {recipes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-medium text-slate-900">No recipes yet</h2>
            <p className="mt-2 text-sm text-slate-500">You haven't added any recipes. Start by creating your first one.</p>
            <div className="mt-6">
              <Link
                href="/recipes/new"
                className="inline-flex items-center rounded-2xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Add your first recipe
              </Link>
            </div>
          </div>
        ) : (
          // Grid of recipe cards
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <article
                key={recipe.id}
                className="group overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"
              >
                {/* Top row: title and category badge */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-medium text-slate-900">{recipe.title}</h3>
                    {recipe.category ? (
                      <p className="mt-1 text-sm text-slate-500">{recipe.category}</p>
                    ) : null}
                  </div>
                </div>

                {/* Description */}
                <p className="mb-4 text-sm text-slate-600">{recipe.description || 'No description provided.'}</p>

                {/* Meta: preparation time and servings */}
                <div className="mb-4 flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
                    <span>{recipe.preparationTime ? `${recipe.preparationTime} min` : '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
                    <span>{recipe.servings ? `${recipe.servings} servings` : '—'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="text-sm font-medium text-indigo-600 hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/recipes/${recipe.id}/edit`}
                      className="text-sm font-medium text-slate-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>

                  <time className="text-xs text-slate-400">{new Date(recipe.createdAt).toLocaleDateString()}</time>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
