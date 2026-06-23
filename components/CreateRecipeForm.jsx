import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { RECIPE_CATEGORIES } from "@/lib/categories";

function linesToJsonString(value) {
  return JSON.stringify(
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  );
}

export default function CreateRecipeForm() {
  async function createRecipe(formData) {
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

    await prisma.recipe.create({
      data: {
        title,
        description: description || null,
        ingredients: linesToJsonString(ingredients),
        instructions: linesToJsonString(instructions),
        imageUrl: imageUrl || null,
        category: category || null,
        preparationTime,
        servings,
        isFavorite: false,
      },
    });

    revalidatePath("/recipes");
    redirect("/recipes");
  }

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const textareaClassName =
    "w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const selectClassName =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <form
      action={createRecipe}
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
            className={inputClassName}
            placeholder="Mediterranean Chickpea Salad"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            rows="3"
            className={textareaClassName}
            placeholder="Short recipe description..."
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
            className={textareaClassName}
            placeholder={
              "2 cans chickpeas, drained\n1 cucumber, diced\n1 lemon, juiced"
            }
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
            className={textareaClassName}
            placeholder={
              "Add ingredients to a bowl.\nMix the dressing.\nServe chilled."
            }
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
            className={inputClassName}
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select name="category" className={selectClassName}>
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
              className={inputClassName}
              placeholder="30"
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
              className={inputClassName}
              placeholder="4"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Add Recipe
          </button>
        </div>
      </div>
    </form>
  );
}