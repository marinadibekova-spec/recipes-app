"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import RecipeForm from '@/components/RecipeForm'

export default function EditRecipePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id
  const [recipe, setRecipe] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Load the existing recipe for editing.
  useEffect(() => {
    const loadRecipe = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await fetch(`/api/recipes/${id}`)
        const result = await response.json()

        if (!response.ok) {
          setErrorMessage(result?.error || 'Unable to load this recipe.')
          setIsLoading(false)
          return
        }

        setRecipe(result.data)
      } catch (error) {
        console.error('Failed to load recipe:', error)
        setErrorMessage('An unexpected error occurred while loading the recipe.')
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipe()
  }, [id])

  // Submit the updated recipe to the API.
  const handleSubmit = async (payload) => {
    const response = await fetch(`/api/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result?.error || 'Unable to update this recipe.')
    }

    router.push(`/recipes/${id}`)
    router.refresh()
  }

  // Render loading and error states before the form is available.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[32px] bg-white px-8 py-12 text-center shadow-[0_40px_80px_rgba(15,23,42,0.08)] sm:px-12">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">Loading recipe</h1>
          <p className="mt-2 text-sm text-slate-500">Fetching the latest recipe details for editing.</p>
        </div>
      </div>
    )
  }

  if (errorMessage || !recipe) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[32px] bg-white px-8 py-12 text-center shadow-[0_40px_80px_rgba(15,23,42,0.08)] sm:px-12">
          <h1 className="text-2xl font-semibold text-slate-900">Recipe unavailable</h1>
          <p className="mt-3 text-sm text-slate-500">
            {errorMessage || 'The recipe could not be loaded for editing.'}
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/recipes"
              className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Back to Recipes
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Page actions */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/recipes/${id}`}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-100"
          >
            Back to Recipe
          </Link>
        </div>

        {/* Edit form */}
        <RecipeForm
          initialData={recipe}
          onSubmit={handleSubmit}
          submitLabel="Update Recipe"
          loadingLabel="Updating recipe..."
        />
      </div>
    </div>
  )
}