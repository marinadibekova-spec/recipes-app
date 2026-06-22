import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma";

/**
 * GET /api/recipes
 * Fetch all recipes with optional filtering
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')?.trim()
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '10')

    // Build combined filters for category and text search.
    const where = {
      ...(category ? { category } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
    }

    // Fetch paginated recipes ordered by newest first.
    const recipes = await prisma.recipe.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    })

    // Count matching recipes for pagination metadata.
    const total = await prisma.recipe.count({ where })

    return NextResponse.json(
      {
        success: true,
        data: recipes,
        pagination: { total, skip, take },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('GET /api/recipes error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch recipes',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/recipes
 * Create a new recipe
 */
export async function POST(request) {
  try {
    const body = await request.json()

    // Validation: title is required
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: 'Title is required and must be a non-empty string',
        },
        { status: 400 }
      )
    }

    // Validation: ingredients should be provided
    if (!body.ingredients || typeof body.ingredients !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: 'Ingredients is required and must be a string (JSON format recommended)',
        },
        { status: 400 }
      )
    }

    // Validation: instructions should be provided
    if (!body.instructions || typeof body.instructions !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: 'Instructions is required and must be a string (JSON format recommended)',
        },
        { status: 400 }
      )
    }

    // Validate JSON strings if provided
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

    // Validate optional fields
    if (body.preparationTime && typeof body.preparationTime !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: 'Preparation time must be a number',
        },
        { status: 400 }
      )
    }

    if (body.servings && typeof body.servings !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: 'Servings must be a number',
        },
        { status: 400 }
      )
    }

    const recipe = await prisma.recipe.create({
      data: {
        title: body.title.trim(),
        description: body.description || null,
        ingredients: body.ingredients,
        instructions: body.instructions,
        imageUrl: body.imageUrl || null,
        category: body.category || null,
        preparationTime: body.preparationTime || null,
        servings: body.servings || null,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: recipe,
        message: 'Recipe created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/recipes error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create recipe',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
