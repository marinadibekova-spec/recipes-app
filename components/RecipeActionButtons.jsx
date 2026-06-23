import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export default function RecipeActionButtons({ recipe }) {
  async function toggleFavorite() {
    "use server";

    await prisma.recipe.update({
      where: { id: recipe.id },
      data: {
        isFavorite: !recipe.isFavorite,
      },
    });

    revalidatePath(`/recipes/${recipe.id}`);
    revalidatePath("/recipes");
  }

  async function deleteRecipe() {
    "use server";

    await prisma.recipe.delete({
      where: { id: recipe.id },
    });

    revalidatePath("/recipes");
    redirect("/recipes");
  }

  return (
    <div className="relative z-10 flex flex-wrap items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
      <form action={toggleFavorite}>
        <button
          type="submit"
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          {recipe.isFavorite ? "★ Remove Favorite" : "☆ Add Favorite"}
        </button>
      </form>

      <Link
        href={`/recipes/${recipe.id}/edit`}
        className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        Edit Recipe
      </Link>

      <form action={deleteRecipe}>
        <button
          type="submit"
          className="inline-flex items-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Delete Recipe
        </button>
      </form>
    </div>
  );
}