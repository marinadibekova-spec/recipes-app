import Link from 'next/link'
import FavoriteRecipeButton from '@/components/FavoriteRecipeButton'

export default function RecipeCard({ recipe }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg">
      {/* Recipe image */}
      {recipe.imageUrl ? (
        <div className="h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-48 w-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400">
          <span className="text-3xl" aria-hidden="true">🍽️</span>
          <span className="text-sm font-medium">No image</span>
        </div>
      )}

      <div className="p-5">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-slate-900">{recipe.title}</h3>
          {recipe.category ? (
            <p className="mt-1 text-sm text-slate-500">{recipe.category}</p>
          ) : null}
        </div>

        <FavoriteRecipeButton recipeId={recipe.id} initialValue={recipe.isFavorite} />
      </div>

      {/* Description */}
      <p className="mb-4 text-sm leading-6 text-slate-600">
        {recipe.description || 'No description provided.'}
      </p>

      {/* Recipe meta */}
      <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
          <span>{recipe.preparationTime ? `${recipe.preparationTime} min` : '—'}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
          <span>{recipe.servings ? `${recipe.servings} servings` : '—'}</span>
        </div>
      </div>

      {/* Card actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/recipes/${recipe.id}`}
            className="text-sm font-medium text-indigo-600 transition hover:underline"
          >
            View
          </Link>

          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="text-sm font-medium text-slate-600 transition hover:underline"
          >
            Edit
          </Link>
        </div>

        <time className="text-xs text-slate-400">
          {new Date(recipe.createdAt).toLocaleDateString()}
        </time>
      </div>
      </div>
    </article>
  )
}