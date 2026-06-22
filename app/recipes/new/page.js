"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddRecipePage() {
  const router = useRouter()

  // Form field state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('')
  const [preparationTime, setPreparationTime] = useState('')
  const [servings, setServings] = useState('')

  // UI state
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Convert multi-line input into a JSON string array.
  const linesToJsonString = (text) => {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    return JSON.stringify(lines)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    // Basic validation
    if (!title.trim()) {
      setErrorMessage('Title is required.')
      return
    }

    if (!ingredients.trim()) {
      setErrorMessage('Please enter at least one ingredient.')
      return
    }

    if (!instructions.trim()) {
      setErrorMessage('Please enter at least one instruction step.')
      return
    }

    setLoading(true)

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      ingredients: linesToJsonString(ingredients),
      instructions: linesToJsonString(instructions),
      imageUrl: imageUrl.trim() || null,
      category: category.trim() || null,
      preparationTime: preparationTime ? Number(preparationTime) : null,
      servings: servings ? Number(servings) : null,
    }

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrorMessage(result?.details || result?.error || 'Unable to create recipe.')
        setLoading(false)
        return
      }

      router.push('/recipes')
      router.refresh()
    } catch (error) {
      console.error('Failed to submit recipe:', error)
      setErrorMessage('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_40px_80px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-r from-indigo-600 to-sky-500 px-8 py-10 sm:px-12 sm:py-12">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Add a new recipe
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
              Share a recipe with your kitchen collection. Enter ingredients and instructions line by line, and we’ll store them as JSON for your API.
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <div className="grid gap-6 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Title</span>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Classic Chocolate Cake"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Category</span>
                  <input
                    type="text"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="Dessert"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Description</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  placeholder="A rich, moist cake with a silky ganache finish."
                  className="mt-2 w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <div className="grid gap-6 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Preparation Time (minutes)</span>
                  <input
                    type="number"
                    value={preparationTime}
                    onChange={(event) => setPreparationTime(event.target.value)}
                    placeholder="45"
                    min="0"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Servings</span>
                  <input
                    type="number"
                    value={servings}
                    onChange={(event) => setServings(event.target.value)}
                    placeholder="4"
                    min="1"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Image URL</span>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://example.com/recipe.jpg"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Ingredients</span>
                <p className="mt-1 text-xs text-slate-500">Enter one ingredient per line.</p>
                <textarea
                  value={ingredients}
                  onChange={(event) => setIngredients(event.target.value)}
                  rows={5}
                  placeholder="2 cups flour\n1 cup sugar\n2 eggs"
                  className="mt-2 w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Instructions</span>
                <p className="mt-1 text-xs text-slate-500">Enter one step per line.</p>
                <textarea
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  rows={6}
                  placeholder="Preheat oven to 350°F.\nMix flour, sugar, and eggs.\nBake for 30 minutes."
                  className="mt-2 w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-700">Submission details</p>
                  <p className="text-sm text-slate-500">The recipe will be saved and you will be redirected to the recipes page.</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {loading ? 'Saving recipe...' : 'Add Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
