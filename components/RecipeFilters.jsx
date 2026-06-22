"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function RecipeFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')

  // Apply the current filter values to the recipes URL.
  const handleSubmit = (event) => {
    event.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (search.trim()) {
      params.set('search', search.trim())
    } else {
      params.delete('search')
    }

    if (category.trim()) {
      params.set('category', category.trim())
    } else {
      params.delete('category')
    }

    const queryString = params.toString()
    router.push(queryString ? `/recipes?${queryString}` : '/recipes')
  }

  // Remove all active filters and return to the base recipes page.
  const handleClear = () => {
    setSearch('')
    setCategory('')
    router.push('/recipes')
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Filter inputs */}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Search</span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or description"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <input
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Dessert"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
        </div>

        {/* Filter actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Filter recipes by keyword and category.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Clear Filters
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}