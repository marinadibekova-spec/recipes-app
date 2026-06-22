"use client"

import { useState } from 'react'

const jsonStringToLines = (value) => {
  if (!value) {
    return ''
  }

  try {
    const parsedValue = JSON.parse(value)
    return Array.isArray(parsedValue) ? parsedValue.join('\n') : ''
  } catch {
    return ''
  }
}

const linesToJsonString = (value) => {
  const lines = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return JSON.stringify(lines)
}

export default function RecipeForm({
  initialData,
  onSubmit,
  submitLabel = 'Save Recipe',
  loadingLabel = 'Saving recipe...',
}) {
  // Form field state
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [ingredients, setIngredients] = useState(jsonStringToLines(initialData?.ingredients))
  const [instructions, setInstructions] = useState(jsonStringToLines(initialData?.instructions))
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')
  const [category, setCategory] = useState(initialData?.category || '')
  const [preparationTime, setPreparationTime] = useState(
    initialData?.preparationTime?.toString() || ''
  )
  const [servings, setServings] = useState(initialData?.servings?.toString() || '')

  // UI state
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isPreviewUnavailable, setIsPreviewUnavailable] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    // Validate required fields
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

    setIsSaving(true)

    try {
      await onSubmit(payload)
    } catch (error) {
      setErrorMessage(error?.message || 'An unexpected error occurred. Please try again.')
      setIsSaving(false)
      return
    }

    setIsSaving(false)
  }

  return (
    <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_40px_80px_rgba(15,23,42,0.08)]">
      <div className="bg-gradient-to-r from-indigo-600 to-sky-500 px-8 py-10 sm:px-12 sm:py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {initialData ? 'Update recipe details' : 'Create a new recipe'}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
          Enter each ingredient and instruction on its own line. The form converts them into JSON strings before submission.
        </p>
      </div>

      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Validation message */}
          {errorMessage ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {/* Core fields */}
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

          {/* Meta fields */}
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
              onChange={(event) => {
                setImageUrl(event.target.value)
                setIsPreviewUnavailable(false)
              }}
              placeholder="https://example.com/recipe.jpg"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          {/* Image preview */}
          {imageUrl.trim() ? (
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 p-3">
              {!isPreviewUnavailable ? (
                <img
                  src={imageUrl}
                  alt={title.trim() || 'Recipe preview'}
                  onError={() => setIsPreviewUnavailable(true)}
                  className="h-56 w-full rounded-3xl object-cover"
                />
              ) : (
                <p className="rounded-3xl bg-white px-4 py-6 text-sm text-slate-500">
                  Image preview unavailable.
                </p>
              )}
            </div>
          ) : null}

          {/* Recipe content */}
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

          {/* Submit action */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">Submission details</p>
              <p className="text-sm text-slate-500">
                The form validates required fields and submits normalized recipe data.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/10 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSaving ? loadingLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
