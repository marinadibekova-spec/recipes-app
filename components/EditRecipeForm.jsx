import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { RECIPE_CATEGORIES } from "@/lib/categories";

function parseJsonArray(value) {
  try {
    const parsedValue = JSON.parse(value);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function linesToJsonString(value) {
  return JSON.stringify(
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  );
}

export default function EditRecipeForm({ recipe }) {
  async function updateRecipe(formData) {
    "use server";

    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const ingredients = String(formData.get("ingredients") || "").trim();
    const instructions = String(formData.get("instructions") || "").trim();
    const imageUrl = String(formData.get("imageUrl") || "").trim();
    const category = String(formData.get("category") || "").trim();

    const preparationTimeValue = String(
      formData.get("preparationTime") || ""
    ).trim();

    const servingsValue = String(formData.get("servings") || "").trim();

    if (!title || !ingredients || !instructions) {
      throw new Error("Title, ingredients and instructions are required.");
    }

    const preparationTime = preparationTimeValue
      ? Number(preparationTimeValue)
      : null;

    const servings = servingsValue ? Number(servingsValue) : null;

    await prisma.recipe.update({
      where: { id: recipe.id },
      data: {
        title,
        description: description || null,
        ingredients: linesToJsonString(ingredients),
        instructions: linesToJsonString(instructions),
        imageUrl: imageUrl || null,
        category: category || null,
        preparationTime,
        servings,
      },
    });

    revalidatePath(`/recipes/${recipe.id}`);
    revalidatePath("/recipes");
    redirect(`/recipes/${recipe.id}`);
  }

  const ingredientsText = parseJsonArray(recipe.ingredients).join("\n");
  const instructionsText = parseJsonArray(recipe.instructions).join("\n");

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const textareaClassName =
    "w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const selectClassName =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <form
      action={updateRecipe}
      className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Title *
          </label>
          <input
            name="title"
            required
            defaultValue={recipe.title}
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            rows="3"
            defaultValue={recipe.description || ""}
            className={textareaClassName}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Ingredients *
          </label>
          <textarea
            name="ingredients"
            required
            rows="7"
            defaultValue={ingredientsText}
            className={textareaClassName}
          />
          <p className="mt-2 text-xs text-slate-400">
            Write each ingredient on a new line.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Instructions *
          </label>
          <textarea
            name="instructions"
            required
            rows="7"
            defaultValue={instructionsText}
            className={textareaClassName}
          />
          <p className="mt-2 text-xs text-slate-400">
            Write each instruction step on a new line.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Image URL
          </label>
          <input
            name="imageUrl"
            defaultValue={recipe.imageUrl || ""}
            className={inputClassName}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              name="category"
              defaultValue={recipe.category || ""}
              className={selectClassName}
            >
              <option value="">Select category</option>
              {RECIPE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Preparation Time
            </label>
            <input
              name="preparationTime"
              type="number"
              min="1"
              defaultValue={recipe.preparationTime || ""}
              className={inputClassName}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Servings
            </label>
            <input
              name="servings"
              type="number"
              min="1"
              defaultValue={recipe.servings || ""}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Update Recipe
          </button>
        </div>
      </div>
    </form>
  );
}