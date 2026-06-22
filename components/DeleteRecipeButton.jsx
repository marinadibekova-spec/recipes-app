"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteRecipeButton({ recipeId }) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Open and close the confirmation modal.
  const handleOpenModal = () => {
    setErrorMessage('')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (isDeleting) {
      return
    }

    setErrorMessage('')
    setIsModalOpen(false)
  }

  // Delete the recipe after confirmation.
  const handleDelete = async () => {
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
    <>
      {/* Delete action */}
      <button
        type="button"
        onClick={handleOpenModal}
        disabled={isDeleting}
        className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
      >
        {isDeleting ? 'Deleting...' : 'Delete Recipe'}
      </button>

      {/* Confirmation modal */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Delete recipe</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Are you sure you want to delete this recipe?
                </p>
              </div>

              {/* Error state */}
              {errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}