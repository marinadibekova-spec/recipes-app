# Prisma Reviewer Skill

## Overview

This skill guides the review, creation, and maintenance of Prisma ORM code in the Recipe Manager application.

Its purpose is to ensure that all database-related code is safe, maintainable, consistent, and aligned with the current project architecture.

---

## Project Context

* Framework: Next.js App Router
* Main language: JavaScript
* Selected project files: TypeScript
* ORM: Prisma ORM
* Database: PostgreSQL
* API Layer: Next.js Route Handlers
* UI Mutations: Server Actions and HTML forms
* Prisma Client Import Pattern: Singleton instance from `lib/prisma.ts`

---

## Prisma Client Rules

### Import Pattern

Always use the shared singleton instance:

```js
import prisma from "@/lib/prisma";
```

Never create additional Prisma clients.

```js
// Wrong
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
```

```js
// Correct
import prisma from "@/lib/prisma";
```

---

## Why Singleton?

Using one shared Prisma client helps prevent:

* multiple PrismaClient instances during development
* connection issues during hot reload
* inconsistent database access patterns
* duplicated setup logic

The shared Prisma client is located in:

```text
lib/prisma.ts
```

---

## Database Rules

### Current Database

The current database provider is:

```prisma
provider = "postgresql"
```

Do not change the provider unless the user explicitly asks for a database migration or environment change.

### Environment Variable

The Prisma datasource should use:

```prisma
url = env("DATABASE_URL")
```

The `.env` file and Vercel environment variables must contain a valid PostgreSQL connection string.

---

## Current Recipe Model

```prisma
model Recipe {
  id              Int      @id @default(autoincrement())
  title           String
  description     String?

  ingredients     String
  instructions    String

  imageUrl        String?
  category        String?
  preparationTime Int?
  servings        Int?
  isFavorite      Boolean  @default(false)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## Schema Change Rules

When changing the Prisma schema:

1. Preserve existing data when possible.
2. Add new fields as optional unless required by the feature.
3. Avoid changing existing field types without a migration plan.
4. Update API routes, Server Actions, forms, and UI components together.
5. Run Prisma commands after schema updates.

Recommended commands:

```bash
npx prisma generate
npx prisma migrate dev --name <migration-name>
```

For production deployment, ensure migrations are committed.

---

## Recipe Data Rules

Ingredients and instructions are stored as JSON strings.

This is intentional.

### Saving

When saving ingredients or instructions, convert arrays to JSON strings:

```js
JSON.stringify(ingredients);
JSON.stringify(instructions);
```

### Reading

When reading ingredients or instructions, parse the JSON strings:

```js
JSON.parse(recipe.ingredients);
JSON.parse(recipe.instructions);
```

### UI Form Handling

In forms, ingredients and instructions are usually entered as multiline text.

Each line should become one array item.

```js
function linesToJsonString(value) {
  return JSON.stringify(
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  );
}
```

### Safe Parsing

When displaying stored recipes, use safe parsing:

```js
function parseJsonArray(value) {
  try {
    const parsedValue = JSON.parse(value);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}
```

---

## Server Action Rules

The project currently uses Server Actions for important UI mutations.

Server Actions are preferred for:

* creating recipes
* editing recipes
* deleting recipes
* toggling favorite status

Current Server Action components include:

```text
components/CreateRecipeForm.jsx
components/EditRecipeForm.jsx
components/RecipeActionButtons.jsx
```

Do not replace these working Server Action flows with client-side `fetch`, `onSubmit`, or `onClick` unless there is a clear reason.

When a Server Action changes recipe data, revalidate affected pages:

```js
revalidatePath("/recipes");
revalidatePath(`/recipes/${recipe.id}`);
```

Use `redirect()` after successful create, edit, or delete when appropriate.

---

## Route Handler Rules

Route Handlers still exist for API access and should remain consistent.

Current API structure:

```text
app/api/recipes/route.js
app/api/recipes/[id]/route.js
```

Supported API operations:

```text
GET /api/recipes
POST /api/recipes
GET /api/recipes/[id]
PUT /api/recipes/[id]
DELETE /api/recipes/[id]
```

Route Handlers should:

1. Validate input.
2. Use proper HTTP status codes.
3. Return consistent JSON.
4. Use try/catch.
5. Avoid exposing sensitive internal errors.
6. Use the shared Prisma client.

---

## Response Format

### Success Response

```js
return NextResponse.json(
  {
    success: true,
    data: recipe,
  },
  { status: 200 }
);
```

### Error Response

```js
return NextResponse.json(
  {
    success: false,
    error: "Validation failed",
    details: "Title is required",
  },
  { status: 400 }
);
```

---

## Status Code Guide

| Code | Usage                               |
| ---- | ----------------------------------- |
| 200  | Successful GET, PUT, or DELETE      |
| 201  | Successful POST                     |
| 400  | Validation error or invalid request |
| 404  | Resource not found                  |
| 500  | Server error                        |

---

## CRUD Standards

All CRUD operations must include:

* input validation
* ID validation
* resource existence checks before update/delete
* proper error handling
* consistent response format
* correct status codes
* efficient Prisma queries

---

## Validation Rules

Before writing to the database, validate:

* required fields are present
* strings are trimmed
* numeric fields are valid numbers or null
* boolean fields are booleans
* JSON string fields contain arrays
* route IDs are valid integers

Example:

```js
if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      details: "Title is required",
    },
    { status: 400 }
  );
}
```

---

## Numeric Field Rules

The following fields may be nullable:

```text
preparationTime
servings
```

Convert empty strings to `null`.

```js
const preparationTime =
  body.preparationTime === null || body.preparationTime === ""
    ? null
    : Number(body.preparationTime);
```

Return validation errors when numeric values are invalid.

---

## Favorite Field Rules

The `isFavorite` field is a boolean.

Validate it before saving:

```js
if (body.isFavorite !== undefined && typeof body.isFavorite !== "boolean") {
  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      details: "isFavorite must be a boolean",
    },
    { status: 400 }
  );
}
```

---

## Query Standards

Use database-level filtering instead of client-side filtering.

### Good

```js
const recipes = await prisma.recipe.findMany({
  where: {
    category: "Dessert",
  },
  orderBy: {
    createdAt: "desc",
  },
});
```

### Bad

```js
const recipes = await prisma.recipe.findMany();
const filtered = recipes.filter((recipe) => recipe.category === "Dessert");
```

---

## Pagination Rules

Use Prisma `skip` and `take`.

```js
const recipes = await prisma.recipe.findMany({
  where,
  skip,
  take: 6,
  orderBy: {
    createdAt: "desc",
  },
});
```

Use `count()` to calculate total pages.

```js
const totalRecipes = await prisma.recipe.count({ where });
```

---

## Sorting Rules

Supported sort options may include:

```text
newest
oldest
favorites
prepTime
```

Example:

```js
function getRecipeOrderBy(sort) {
  if (sort === "oldest") {
    return { createdAt: "asc" };
  }

  if (sort === "favorites") {
    return [{ isFavorite: "desc" }, { createdAt: "desc" }];
  }

  if (sort === "prepTime") {
    return [{ preparationTime: "asc" }, { createdAt: "desc" }];
  }

  return { createdAt: "desc" };
}
```

---

## Server Component Data Access

Use direct Prisma queries inside Server Components.

Do not fetch internal API routes from Server Components.

### Good

```js
const recipe = await prisma.recipe.findUnique({
  where: { id: recipeId },
});
```

### Avoid

```js
const response = await fetch("/api/recipes/1");
```

---

## Resource Existence Checks

Before update or delete, check that the recipe exists.

```js
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
```

---

## Error Handling Rules

Inside Route Handlers:

```js
try {
  // Prisma logic
} catch (error) {
  console.error("Recipe operation error:", error);

  return NextResponse.json(
    {
      success: false,
      error: "Something went wrong",
    },
    { status: 500 }
  );
}
```

Avoid returning raw internal error messages to users unless they are safe and useful.

---

## Migration Rules

Before creating a migration:

1. Review the schema change.
2. Consider existing production data.
3. Prefer optional fields for new features.
4. Run migration locally first.
5. Commit migration files.
6. Ensure Vercel has the correct `DATABASE_URL`.

Migration command:

```bash
npx prisma migrate dev --name <migration-name>
```

Generate Prisma client:

```bash
npx prisma generate
```

---

## API Review Checklist

Before accepting API route code, verify:

* [ ] Uses `import prisma from "@/lib/prisma"`
* [ ] Does not instantiate `new PrismaClient()`
* [ ] Validates route params
* [ ] Validates request body
* [ ] Handles JSON string fields correctly
* [ ] Handles nullable numeric fields correctly
* [ ] Handles `isFavorite` as boolean
* [ ] Checks resource existence before update/delete
* [ ] Uses correct Prisma methods
* [ ] Uses database-level filters
* [ ] Uses correct HTTP status codes
* [ ] Returns `{ success, data }` or `{ success, error }`
* [ ] Logs server errors
* [ ] Does not expose sensitive internals

---

## Server Action Review Checklist

Before accepting Server Action code, verify:

* [ ] Uses `"use server"` inside the action
* [ ] Uses the shared Prisma client
* [ ] Validates required fields
* [ ] Converts multiline ingredients/instructions to JSON strings
* [ ] Converts empty optional fields to `null`
* [ ] Revalidates affected paths
* [ ] Redirects after successful create, edit, or delete when appropriate
* [ ] Does not rely on unnecessary client-side JavaScript

---

## Performance Guidelines

* Filter at database level.
* Sort at database level.
* Paginate at database level.
* Use `count()` for totals.
* Avoid N+1 queries.
* Avoid fetching all recipes when only a page is needed.
* Avoid client-side filtering for large datasets.

---

## Quality Checklist

Before finishing database-related code, verify:

* [ ] Correct Prisma singleton import
* [ ] No extra Prisma clients
* [ ] PostgreSQL provider preserved
* [ ] `DATABASE_URL` usage preserved
* [ ] Schema changes are intentional
* [ ] Data validation is complete
* [ ] JSON fields are handled correctly
* [ ] Server Actions revalidate affected paths
* [ ] Route Handlers return consistent JSON
* [ ] Database queries are efficient
* [ ] Existing features still work

---

## Example Prompts

Use this skill for prompts such as:

* "Review this API route for validation and Prisma best practices."
* "Update this Server Action to safely edit a recipe."
* "Check whether this Prisma query should be optimized."
* "Add a new optional field to the Recipe model safely."
* "Fix this migration or Prisma schema issue."
* "Review JSON string handling for ingredients and instructions."

---

## Guiding Principle

Database code should be safe, predictable, maintainable, and consistent with the current Recipe Manager architecture.

Use Prisma carefully, preserve the existing data model, and prefer server-side data handling patterns that already work in this project.

