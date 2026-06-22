# Prisma Reviewer Skill

## Overview

This skill guides the review, creation, and maintenance of Prisma ORM code in the Recipe Management Application. It ensures database operations are performant, maintainable, and follow consistent patterns across all API routes and Server Components.

## Project Context

- **Framework:** Next.js App Router
- **Language:** JavaScript
- **ORM:** Prisma ORM
- **Database:** SQLite
- **API Layer:** REST API with Route Handlers
- **Client Import Pattern:** Singleton instance from `lib/prisma.js`

---

## Prisma Client Rules

### Import Pattern

**Always use the singleton instance:**

```js
import prisma from "@/lib/prisma";
```

**Never create additional clients:**

```js
// ❌ WRONG
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ✅ CORRECT
import prisma from "@/lib/prisma";
```

### Why Singleton?

- Prevents connection pool exhaustion in development
- Ensures consistent client state
- Avoids multiple instantiations in hot-reload environments
- Maintains single database connection

---

## Database Rules

### Current Database

```prisma
provider = "sqlite"
```

**Never change without explicit request.** SQLite is configured for development and demonstration purposes.

### Schema Changes

- **Avoid breaking migrations** — preserve existing fields and data
- **Maintain backward compatibility** — optional fields when adding new columns
- **Don't modify existing field types** without planning data migration
- **Document schema intent** with comments in `prisma/schema.prisma`

### Example: Safe Schema Change

```prisma
// Old schema
model Recipe {
  id    Int     @id @default(autoincrement())
  title String
}

// Safe: add optional field
model Recipe {
  id          Int      @id @default(autoincrement())
  title       String
  description String?  // Optional — existing records unaffected
}

// Unsafe: change existing field type
model Recipe {
  id    String  @id  // ❌ Changes Int → String, breaks existing data
  title String
}
```

---

## Recipe Model Rules

### JSON String Storage

Ingredients and instructions are stored as **JSON strings** (not JSON types), matching the Prisma schema.

### When Saving (API Routes)

```js
// Receive array from client, convert to JSON string for storage
const payload = {
  title: "Chocolate Cake",
  ingredients: JSON.stringify(["2 cups flour", "1 cup sugar", "2 eggs"]),
  instructions: JSON.stringify(["Preheat oven", "Mix ingredients", "Bake 30 min"])
};

const recipe = await prisma.recipe.create({
  data: payload
});
```

### When Reading (Server Components or API responses)

```js
// Parse JSON strings when retrieving from database
const recipe = await prisma.recipe.findUnique({
  where: { id: 1 }
});

const ingredients = JSON.parse(recipe.ingredients);  // String → Array
const instructions = JSON.parse(recipe.instructions); // String → Array
```

### Client-Side Handling

```js
// In forms: collect lines, convert to array, then stringify
const ingredientLines = ingredients
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);

const payload = {
  ingredients: JSON.stringify(ingredientLines),
  instructions: JSON.stringify(instructionLines)
};

await fetch('/api/recipes', {
  method: 'POST',
  body: JSON.stringify(payload)
});
```

### Validation

Support both formats in validation:

```js
const parseIngredients = (input) => {
  if (typeof input === 'string') {
    try {
      return JSON.parse(input); // Try JSON string
    } catch {
      return input.split('\n').filter(Boolean); // Fallback to lines
    }
  }
  return input; // Already array
};
```

---

## CRUD Standards

### All CRUD Operations Must Include

1. **Input Validation** — Check required fields, types, and formats
2. **Error Handling** — Wrap in try/catch
3. **Resource Checks** — Verify existence before update/delete
4. **Proper Status Codes** — 200, 201, 400, 404, 500
5. **Consistent Responses** — Always `{ success, data/error }`

### Response Format

**Success Response:**

```js
return NextResponse.json(
  {
    success: true,
    data: recipe,
    message: "Operation completed"
  },
  { status: 200 }
);
```

**Error Response:**

```js
return NextResponse.json(
  {
    success: false,
    error: "Validation failed",
    details: "Title is required"
  },
  { status: 400 }
);
```

### Status Code Guide

| Code | Usage | Example |
|------|-------|---------|
| 200 | GET successful, PUT successful, DELETE successful | Retrieved recipe, updated recipe, deleted recipe |
| 201 | POST successful (created) | Created new recipe |
| 400 | Validation error or bad request | Missing title, invalid JSON |
| 404 | Resource not found | Recipe ID doesn't exist |
| 500 | Server error | Database connection failed |

### CRUD Template

```js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// CREATE
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: "Title required" },
        { status: 400 }
      );
    }

    // Create record
    const recipe = await prisma.recipe.create({
      data: {
        title: body.title.trim(),
        ingredients: body.ingredients,
        instructions: body.instructions
      }
    });

    return NextResponse.json(
      { success: true, data: recipe },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create", details: error.message },
      { status: 500 }
    );
  }
}

// READ
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID" },
        { status: 400 }
      );
    }

    const recipe = await prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: recipe }, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

// UPDATE
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    const recipe = await prisma.recipe.update({
      where: { id },
      data: { title: body.title?.trim() || existing.title }
    });

    return NextResponse.json({ success: true, data: recipe }, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    const recipe = await prisma.recipe.delete({ where: { id } });

    return NextResponse.json({ success: true, data: recipe }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete" },
      { status: 500 }
    );
  }
}
```

---

## Query Standards

### Recommended Prisma Methods

| Method | Usage | Example |
|--------|-------|---------|
| `findMany()` | Fetch multiple records | `prisma.recipe.findMany({ where: { category: "Dessert" } })` |
| `findUnique()` | Fetch single by unique field | `prisma.recipe.findUnique({ where: { id: 1 } })` |
| `findFirst()` | Fetch first matching | `prisma.recipe.findFirst({ where: { title: "Cake" } })` |
| `create()` | Create new record | `prisma.recipe.create({ data: {...} })` |
| `update()` | Update record | `prisma.recipe.update({ where: { id: 1 }, data: {...} })` |
| `delete()` | Delete record | `prisma.recipe.delete({ where: { id: 1 } })` |
| `count()` | Count matching records | `prisma.recipe.count({ where: {...} })` |

### Query Patterns

**Ordering (common: by date descending):**

```js
await prisma.recipe.findMany({
  orderBy: { createdAt: 'desc' }
});
```

**Filtering:**

```js
await prisma.recipe.findMany({
  where: {
    category: "Dessert",
    preparationTime: { lte: 30 }
  }
});
```

**Pagination:**

```js
await prisma.recipe.findMany({
  skip: 0,
  take: 10,
  orderBy: { createdAt: 'desc' }
});
```

**Counting:**

```js
const total = await prisma.recipe.count({ where: { category: "Dessert" } });
```

### Performance: Database vs Client Filtering

**✅ Good — Filter at database level:**

```js
const recipes = await prisma.recipe.findMany({
  where: { category: "Dessert" }
});
```

**❌ Bad — Fetch all, filter in code:**

```js
const allRecipes = await prisma.recipe.findMany();
const filtered = allRecipes.filter(r => r.category === "Dessert");
```

The second approach loads unnecessary data and is slower.

---

## Validation Rules

### Input Validation Checklist

- [ ] Required fields present and non-empty
- [ ] String fields trimmed
- [ ] Numeric fields are numbers (not strings)
- [ ] ID fields are valid integers
- [ ] JSON fields parse without error
- [ ] Optional fields handled correctly
- [ ] Field lengths reasonable
- [ ] Enum values match schema

### Validation Example

```js
// Validate title
if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
  return NextResponse.json(
    { success: false, error: "Validation failed", details: "Title required" },
    { status: 400 }
  );
}

// Validate numeric field
if (body.preparationTime && typeof body.preparationTime !== 'number') {
  return NextResponse.json(
    { success: false, error: "Validation failed", details: "Prep time must be number" },
    { status: 400 }
  );
}

// Validate JSON field
try {
  const parsed = JSON.parse(body.ingredients);
  if (!Array.isArray(parsed)) throw new Error("Must be array");
} catch {
  return NextResponse.json(
    { success: false, error: "Validation failed", details: "Invalid ingredients JSON" },
    { status: 400 }
  );
}
```

---

## Migrations

### Before Running Migration

1. **Review Changes:** Read the schema diff carefully
2. **Check Data:** Consider existing records and backward compatibility
3. **Plan Rollback:** Know how to revert if needed
4. **Test Locally:** Run migration on dev database first

### Running Migrations

**Create and apply migration:**

```bash
npx prisma migrate dev --name add_recipe_category
```

**Create migration without applying:**

```bash
npx prisma migrate dev --name add_recipe_category --create-only
```

**Reset database (dev only):**

```bash
npx prisma migrate reset
```

### Migration Naming

**✅ Good names:**
- `add_recipe_category`
- `make_description_optional`
- `add_preparation_time_index`
- `rename_prep_time_to_preparationTime`

**❌ Avoid:**
- `init2`
- `test`
- `update`
- `fix`

---

## API Review Checklist

Before submitting or accepting generated API route code, verify:

### Prisma Usage

- [ ] Imports `import prisma from "@/lib/prisma"` (not `new PrismaClient()`)
- [ ] No additional Prisma instances created
- [ ] Uses correct query methods (`findMany`, `findUnique`, `create`, etc.)
- [ ] Query is efficient (database filters, not client-side)

### Error Handling

- [ ] All Prisma operations wrapped in try/catch
- [ ] Catches and logs errors
- [ ] Returns user-friendly error messages
- [ ] Never exposes internal errors to client

### Validation

- [ ] Input validated before Prisma operation
- [ ] Validates required fields
- [ ] Validates data types
- [ ] Validates numeric fields as numbers
- [ ] Validates JSON fields parse correctly
- [ ] Returns 400 for validation errors

### Response Consistency

- [ ] All responses use `{ success, data/error }` format
- [ ] Uses correct HTTP status codes (200, 201, 400, 404, 500)
- [ ] Error responses include details
- [ ] Success responses include data

### Data Handling

- [ ] JSON fields (ingredients, instructions) handled correctly
- [ ] Strings trimmed before storage
- [ ] Optional fields nullable (`|| null`)
- [ ] Handles missing resources (404 check)

### Sample Review

```js
// ✅ PASS: Proper error handling, validation, imports, status codes
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title required" },
        { status: 400 }
      );
    }

    const recipe = await prisma.recipe.create({
      data: { title: body.title.trim() }
    });

    return NextResponse.json(
      { success: true, data: recipe },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { success: false, error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}

// ❌ FAIL: Missing validation, wrong import, no error handling
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();
  const recipe = await prisma.recipe.create({ data: body });
  return Response.json(recipe);
}
```

---

## Performance Guidelines

### Database Operations

✅ **Do filter at database level:**

```js
const recipes = await prisma.recipe.findMany({
  where: { category: filter },
  orderBy: { createdAt: 'desc' },
  take: 10
});
```

❌ **Don't fetch and filter in code:**

```js
const recipes = await prisma.recipe.findMany();
return recipes
  .filter(r => r.category === filter)
  .sort((a, b) => b.createdAt - a.createdAt)
  .slice(0, 10);
```

### Connection Management

- Use singleton instance (`lib/prisma.js`)
- Don't create new clients per request
- Let Prisma manage connection pooling

### Query Optimization

**Avoid N+1 queries:**

```js
// ❌ Bad: 1 + N queries (slow)
const recipes = await prisma.recipe.findMany();
recipes.forEach(async (recipe) => {
  const tags = await prisma.tag.findMany({
    where: { recipeId: recipe.id }
  });
});

// ✅ Good: 1 query with include (fast)
const recipes = await prisma.recipe.findMany({
  include: { tags: true }
});
```

---

## Workflow: Reviewing an API Route

### Step 1: Check Imports

```js
// ✅ Correct
import prisma from '@/lib/prisma';

// ❌ Wrong
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

### Step 2: Check Error Handling

```js
// ✅ Good
try {
  const recipe = await prisma.recipe.create({ data: {...} });
  return NextResponse.json({ success: true, data: recipe }, { status: 201 });
} catch (error) {
  console.error('Error:', error);
  return NextResponse.json(
    { success: false, error: 'Failed to create' },
    { status: 500 }
  );
}

// ❌ Bad (no try/catch)
const recipe = await prisma.recipe.create({ data: body });
return Response.json(recipe);
```

### Step 3: Check Validation

```js
// ✅ Good
if (!body.title?.trim()) {
  return NextResponse.json(
    { success: false, error: "Title required" },
    { status: 400 }
  );
}

// ❌ Bad (no validation)
const recipe = await prisma.recipe.create({ data: body });
```

### Step 4: Check Status Codes

- POST → 201 (or 400/500)
- GET → 200 (or 404/500)
- PUT → 200 (or 404/500)
- DELETE → 200 (or 404/500)

### Step 5: Check Response Format

```js
// ✅ Consistent
{ success: true, data: {...} }
{ success: false, error: "...", details: "..." }

// ❌ Inconsistent
{ recipe: {...} }
{ error: "..." }
```

---

## Quality Checklist

Before finishing database code, verify:

- [ ] Correct Prisma import (singleton from `lib/prisma.js`)
- [ ] No additional PrismaClient instances
- [ ] All database operations in try/catch
- [ ] Input validation before Prisma queries
- [ ] Proper HTTP status codes (200, 201, 400, 404, 500)
- [ ] Consistent `{ success, data/error }` responses
- [ ] JSON fields handled correctly (stringify on save, parse on read)
- [ ] Resource existence checked before update/delete (404 handling)
- [ ] Error messages descriptive but not exposing internals
- [ ] Queries efficient (database filtering, not client-side)
- [ ] Optional fields nullable (`|| null`)
- [ ] Strings trimmed before storage
- [ ] Commented for major sections

---

## Example Prompts

**"Review this API route and ensure it has proper validation, error handling, and status codes."**

**"Create a GET endpoint for fetching recipes by category with pagination support and proper ordering."**

**"Build a PUT endpoint that updates a recipe and returns the updated record with 200 status on success."**

**"Add validation to this POST route that checks for required fields and returns a 400 error with descriptive message."**

**"Create a migration that adds an optional 'image' field to the Recipe model without breaking existing data."**

---

## Related Skills & Customizations

- **API Testing:** Create skill for testing endpoints with curl/Postman
- **Database Optimization:** Advanced indexing and query optimization
- **Schema Design:** Naming conventions and relationships
- **Backup & Recovery:** Database backup and restoration procedures
