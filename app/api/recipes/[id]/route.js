import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Convert route parameter to integer ID.
 * Returns null if ID is invalid.
 */
async function parseRecipeId(params) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);

  if (Number.isNaN(id)) {
    return null;
  }

  return id;
}

/**
 * Normalize ingredients/instructions.
 *
 * Accepts:
 * - JavaScript array
 * - JSON string
 *
 * Returns:
 * - JSON string ready for database storage
 */
function normalizeJsonField(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  // Convert array to JSON string
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  // Validate JSON string
  if (typeof value === "string") {
    try {
      JSON.parse(value);
      return value;
    } catch {
      throw new Error(
        `${fieldName} must be a valid JSON string or an array`
      );
    }
  }

  throw new Error(
    `${fieldName} must be a valid JSON string or an array`
  );
}

/**
 * GET /api/recipes/[id]
 *
 * Fetch a single recipe by ID
 */
export async function GET(request, { params }) {
  try {
    // Validate route parameter
    const id = await parseRecipeId(params);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid recipe ID",
        },
        { status: 400 }
      );
    }

    // Fetch recipe from database
    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    // Recipe not found
    if (!recipe) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipe not found",
        },
        { status: 404 }
      );
    }

    // Return recipe
    return NextResponse.json(
      {
        success: true,
        data: recipe,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET recipe error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch recipe",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/recipes/[id]
 *
 * Update an existing recipe
 */
export async function PUT(request, { params }) {
  try {
    // Validate route parameter
    const id = await parseRecipeId(params);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid recipe ID",
        },
        { status: 400 }
      );
    }

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!existingRecipe) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipe not found",
        },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate title if provided
    if (body.title !== undefined) {
      if (
        typeof body.title !== "string" ||
        body.title.trim() === ""
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Title must be a non-empty string",
          },
          { status: 400 }
        );
      }
    }

    // Validate numeric fields
    const preparationTime =
  body.preparationTime === null || body.preparationTime === ""
    ? null
    : Number(body.preparationTime);

const servings =
  body.servings === null || body.servings === ""
    ? null
    : Number(body.servings);

if (
  body.preparationTime !== undefined &&
  preparationTime !== null &&
  Number.isNaN(preparationTime)
) {
  return NextResponse.json(
    {
      success: false,
      error: "Preparation time must be a number",
    },
    { status: 400 }
  );
}

if (
  body.servings !== undefined &&
  servings !== null &&
  Number.isNaN(servings)
) {
  return NextResponse.json(
    {
      success: false,
      error: "Servings must be a number",
    },
    { status: 400 }
  );
}

    // Validate optional favorite flag.
    if (body.isFavorite !== undefined && typeof body.isFavorite !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "isFavorite must be a boolean",
        },
        { status: 400 }
      );
    }

    // Normalize ingredients and instructions
    let ingredients;
    let instructions;

    try {
      ingredients = normalizeJsonField(
        body.ingredients,
        "Ingredients"
      );

      instructions = normalizeJsonField(
        body.instructions,
        "Instructions"
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    // Build update object dynamically
    const updateData = {};

    if (body.title !== undefined) {
      updateData.title = body.title.trim();
    }

    if (body.description !== undefined) {
      updateData.description = body.description || null;
    }

    if (ingredients !== undefined) {
      updateData.ingredients = ingredients;
    }

    if (instructions !== undefined) {
      updateData.instructions = instructions;
    }

    if (body.imageUrl !== undefined) {
      updateData.imageUrl = body.imageUrl || null;
    }

    if (body.category !== undefined) {
      updateData.category = body.category || null;
    }

    if (body.preparationTime !== undefined) {
  updateData.preparationTime = preparationTime;
}

    if (body.servings !== undefined) {
   updateData.servings = servings;
}

    if (body.isFavorite !== undefined) {
      updateData.isFavorite = body.isFavorite;
    }

    // Update recipe
    const recipe = await prisma.recipe.update({
      where: { id },
      data: updateData,
    });

    // Return updated recipe
    return NextResponse.json(
      {
        success: true,
        data: recipe,
        message: "Recipe updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT recipe error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update recipe",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/recipes/[id]
 *
 * Delete recipe by ID
 */
export async function DELETE(request, { params }) {
  try {
    // Validate route parameter
    const id = await parseRecipeId(params);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid recipe ID",
        },
        { status: 400 }
      );
    }

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!existingRecipe) {
      return NextResponse.json(
        {
          success: false,
          error: "Recipe not found",
        },
        { status: 404 }
      );
    }

    // Delete recipe
    const recipe = await prisma.recipe.delete({
      where: { id },
    });

    // Return deleted recipe
    return NextResponse.json(
      {
        success: true,
        data: recipe,
        message: "Recipe deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE recipe error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete recipe",
      },
      { status: 500 }
    );
  }
}