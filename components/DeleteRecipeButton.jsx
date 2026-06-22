"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteRecipeButton({ recipeId }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Confirm deletion and remove the recipe through the API.
  const handleDelete = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this recipe?')

    if (!isConfirmed) {
      return
    }

    setIsDeleting(true)
    setErrorMessage('')

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || 'Failed to delete recipe.')
      }

      router.push('/recipes')
      router.refresh()
    } catch (error) {
      console.error('Delete recipe error:', error)
      setErrorMessage(error?.message || 'An unexpected error occurred while deleting the recipe.')
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Error state */}
      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {/* Delete action */}
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
      >
        {isDeleting ? 'Deleting...' : 'Delete Recipe'}
      </button>
    </div>
  )
}