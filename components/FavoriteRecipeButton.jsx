"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FavoriteRecipeButton({ recipeId, initialValue }) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(Boolean(initialValue))
  const [errorMessage, setErrorMessage] = useState('')

  // Toggle the favorite state optimistically and sync it with the API.
  const handleToggleFavorite = async () => {
    const nextValue = !isFavorite

    setErrorMessage('')
    setIsFavorite(nextValue)

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFavorite: nextValue }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || 'Failed to update favorite status.')
      }

      router.refresh()
    } catch (error) {
      console.error('Favorite recipe error:', error)
      setIsFavorite(!nextValue)
      setErrorMessage(error?.message || 'Unable to update favorite status.')
    }
  }

  return (
    <div className="space-y-2">
      {/* Favorite toggle */}
      <button
        type="button"
        onClick={handleToggleFavorite}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-xl transition ${
          isFavorite
            ? 'border-amber-200 bg-amber-50 text-amber-500 hover:bg-amber-100'
            : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600'
        }`}
      >
        <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
      </button>

      {/* Error state */}
      {errorMessage ? (
        <p className="text-xs text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  )
}