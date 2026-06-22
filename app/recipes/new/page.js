"use client";

import { useRouter } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";
import PageHeader from "@/components/PageHeader";

export default function AddRecipePage() {
  const router = useRouter();

  async function handleCreateRecipe(payload) {
    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.details || result?.error || "Failed to create recipe."
      );
    }

    router.push("/recipes");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Add Recipe"
          description="Create a new recipe for your collection."
          actionLabel="Back to Recipes"
          actionHref="/recipes"
        />

        <RecipeForm
          onSubmit={handleCreateRecipe}
          submitLabel="Add Recipe"
          loadingLabel="Saving recipe..."
        />
      </div>
    </div>
  );
}