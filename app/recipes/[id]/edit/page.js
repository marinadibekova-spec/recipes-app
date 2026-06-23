import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import EditRecipeClient from "@/components/EditRecipeClient";

export default async function EditRecipePage({ params }) {
  const { id } = await params;
  const recipeId = Number(id);

  if (Number.isNaN(recipeId)) {
    notFound();
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Edit Recipe"
          description="Update recipe details and save your changes."
          actionLabel="Back to Recipe"
          actionHref={`/recipes/${recipe.id}`}
        />

        <EditRecipeClient recipe={recipe} />
      </div>
    </div>
  );
}