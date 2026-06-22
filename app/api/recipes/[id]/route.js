import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/recipes/[id]
 * Fetch a single recipe by ID
 */
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id)

    // Validate ID
    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid recipe ID',
          details: 'Recipe ID must be a valid integer',
        },
        { status: 400 }
      )
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!recipe) {
      return NextResponse.json(
        {
          success: false,
          error: 'Recipe not found',
          details: `No recipe found with ID ${id}`,
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: recipe,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(`GET /api/recipes/[id] error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch recipe',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/recipes/[id]
 * Update a recipe by ID
 */
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id)

    // Validate ID
    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid recipe ID',
          details: 'Recipe ID must be a valid integer',
        },
        { status: 400 }
      )
    }

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!existingRecipe) {
      return NextResponse.json(
        {
          success: false,
          error: 'Recipe not found',
          details: `No recipe found with ID ${id}`,
        },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Validation: title if provided
    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim() === '') {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            details: 'Title must be a non-empty string',
          },
          { status: 400 }
        )
      }
    }

    // Validate JSON strings if provided
    if (body.ingredients || body.instructions) {
      try {
        if (body.ingredients) JSON.parse(body.ingredients)
        if (body.instructions) JSON.parse(body.instructions)
      } catch (e) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            details: 'Ingredients and instructions must be valid JSON strings',
          },
          { status: 400 }
        )
      }
    }

    // Validate optional numeric fields
    if (body.preparationTime !== undefined && typeof body.preparationTime !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: 'Preparation time must be a number',
        },
        { status: 400 }
      )
    }

    if (body.servings !== undefined && typeof body.servings !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: 'Servings must be a number',
        },
        { status: 400 }
      )
    }

    // Build update data
    const updateData = {}
    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.description !== undefined) updateData.description = body.description
    if (body.ingredients !== undefined) updateData.ingredients = body.ingredients
    if (body.instructions !== undefined) updateData.instructions = body.instructions
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl
    if (body.category !== undefined) updateData.category = body.category
    if (body.preparationTime !== undefined) updateData.preparationTime = body.preparationTime
    if (body.servings !== undefined) updateData.servings = body.servings

    const recipe = await prisma.recipe.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(
      {
        success: true,
        data: recipe,
        message: 'Recipe updated successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(`PUT /api/recipes/[id] error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update recipe',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/recipes/[id]
 * Delete a recipe by ID
 */
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id)

    // Validate ID
    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid recipe ID',
          details: 'Recipe ID must be a valid integer',
        },
        { status: 400 }
      )
    }

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    })

    if (!existingRecipe) {
      return NextResponse.json(
        {
          success: false,
          error: 'Recipe not found',
          details: `No recipe found with ID ${id}`,
        },
        { status: 404 }
      )
    }

    const recipe = await prisma.recipe.delete({
      where: { id },
    })

    return NextResponse.json(
      {
        success: true,
        data: recipe,
        message: 'Recipe deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(`DELETE /api/recipes/[id] error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete recipe',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
