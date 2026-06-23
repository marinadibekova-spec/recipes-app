"use client";

import { useRouter } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";

export default function EditRecipeClient({ recipe }) {
  const router = useRouter();

  async function handleSubmit(payload) {
    const response = await fetch(`/api/recipes/${recipe.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.details || result?.error || "Unable to update recipe.");
    }

    router.push(`/recipes/${recipe.id}`);
    router.refresh();
  }

  return (
    <RecipeForm
      key={recipe.id}
      initialData={recipe}
      onSubmit={handleSubmit}
      submitLabel="Update Recipe"
      loadingLabel="Updating recipe..."
    />
  );
}