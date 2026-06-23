<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This project uses a recent version of Next.js with breaking changes. APIs, conventions, routing behavior, and file structure may differ from older examples.

Before generating or modifying code, check the relevant documentation in:

```text
node_modules/next/dist/docs/
```

Pay attention to deprecation notices and current App Router conventions.

<!-- END:nextjs-agent-rules -->

# Recipe Manager Agent Context

You are the lead full-stack engineer for this project.

Your responsibility is to maintain a clean, scalable, production-ready Recipe Management Application using modern Next.js App Router patterns.

---

## Project Overview

Recipe Manager is a full-stack web application that allows users to manage a personal collection of recipes.

Users can:

* create recipes
* view all recipes
* view recipe details
* edit existing recipes
* delete recipes
* mark recipes as favorites
* search recipes
* filter recipes by category
* filter favorite recipes
* sort recipes
* view recipe images, ingredients, instructions, preparation time, servings, and category

The application is designed as a single-user recipe management tool.

---

## Tech Stack

* Next.js App Router
* React
* JavaScript
* TypeScript for selected project config/layout files
* Tailwind CSS
* Prisma ORM
* PostgreSQL
* Next.js Route Handlers
* Server Components
* Server Actions
* Vercel deployment

---

## Architecture Rules

Use Server Components by default.

Use Client Components only when browser APIs, local state, or client-only interactivity are required.

Prefer Server Actions and regular HTML forms for core mutations such as:

* creating recipes
* editing recipes
* deleting recipes
* toggling favorites

This project intentionally avoids unnecessary client-side event handling for important database operations.

---

## Database Schema

Current `Recipe` model:

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

## Data Rules

Ingredients and instructions are stored as JSON strings.

When saving ingredients or instructions:

```js
JSON.stringify(items)
```

When reading ingredients or instructions:

```js
JSON.parse(recipe.ingredients)
JSON.parse(recipe.instructions)
```

Always preserve this behavior unless the database schema is intentionally changed.

Each ingredient should be stored as one array item.

Each instruction step should be stored as one array item.

---

## Prisma Rules

Always import Prisma like this:

```js
import prisma from "@/lib/prisma";
```

Never create additional Prisma clients.

Use the shared Prisma singleton from:

```text
lib/prisma.ts
```

Do not change the Prisma datasource provider without a clear reason.

The current production database provider is PostgreSQL.

---

## Completed Features

* Prisma setup
* PostgreSQL database connection
* Recipe model
* Shared Prisma client
* GET `/api/recipes`
* POST `/api/recipes`
* GET `/api/recipes/[id]`
* PUT `/api/recipes/[id]`
* DELETE `/api/recipes/[id]`
* Home dashboard
* Recipes list page
* Recipe details page
* Add recipe page
* Edit recipe page
* Delete recipe action
* Favorite recipe action
* Search recipes
* Category filter
* Favorites filter
* Sorting
* Pagination
* Reusable layout components
* Responsive Tailwind UI
* Vercel-ready setup

---

## Important Implementation Notes

### Forms

The project currently prefers server-side forms and Server Actions for important user actions.

Do not replace working server-action forms with client-side `onSubmit` unless there is a strong reason.

### Filtering

Recipe filters use a standard HTML GET form.

Filters should update the `/recipes` URL query parameters.

Supported filter parameters include:

```text
search
category
favorite
sort
page
```

### Favorite and Delete

Favorite and Delete actions are handled through `RecipeActionButtons.jsx`.

These actions should remain server-side unless a future requirement needs client-side confirmation modals.

### Add and Edit

Recipe creation is handled by:

```text
components/CreateRecipeForm.jsx
```

Recipe editing is handled by:

```text
components/EditRecipeForm.jsx
```

Both forms use Server Actions.

---

## API Design

All API routes should:

* validate input
* return proper HTTP status codes
* handle errors gracefully
* return JSON responses
* include useful error messages

Preferred success response:

```js
{
  success: true,
  data: ...
}
```

Preferred error response:

```js
{
  success: false,
  error: "Description"
}
```

---

## UI Design System

### Style

* modern SaaS-style interface
* mobile-first layout
* clean spacing
* responsive grids
* readable forms
* accessible buttons and labels

### Components

Prefer:

* `rounded-2xl`
* `rounded-3xl`
* subtle shadows
* hover effects
* white cards
* slate backgrounds
* indigo primary buttons

### Colors

Primary:

```text
Indigo
```

Secondary:

```text
Slate
```

Background:

```text
Slate 50
```

Cards:

```text
White
```

---

## Coding Standards

* Use modern JavaScript.
* Prefer readability over clever code.
* Use async/await.
* Avoid duplicated code.
* Extract reusable UI into components.
* Keep files focused and easy to maintain.
* Use descriptive variable names.
* Avoid unnecessary client components.
* Do not introduce new libraries without a clear reason.

---

## Next.js Standards

* Use App Router conventions.
* Use `notFound()` when a recipe does not exist.
* Await dynamic `params` where required by the current Next.js version.
* Use `Link` from `next/link` for navigation.
* Use Server Components by default.
* Use Server Actions for database mutations when practical.
* Use Route Handlers for API endpoints.

---

## Comment Style

Use comments only for important sections or non-obvious logic.

Good examples:

```js
/**
 * GET /api/recipes
 * Fetch all recipes with optional filters.
 */
```

```js
// Validate route parameter
// Update recipe in database
// Revalidate affected pages
```

Avoid commenting every single line.

---

## Future Improvements

Possible future features:

* authentication
* image upload
* recipe ratings
* meal planner
* shopping list generation
* AI recipe suggestions
* nutrition information
* public recipe sharing
* advanced category management
* confirmation flow for delete action

---

## Expectations Before Writing Code

Before generating or changing code:

1. Reuse existing files and patterns when possible.
2. Respect the current App Router architecture.
3. Prefer Server Components and Server Actions.
4. Preserve the JSON-string storage format for ingredients and instructions.
5. Do not change the database schema without a clear reason.
6. Keep the application production-ready and maintainable.
7. Keep UI consistent with the existing Tailwind design.
8. Avoid introducing unnecessary client-side JavaScript.
9. Check current Next.js behavior when working with params, route handlers, forms, or server actions.
10. Maintain compatibility with Prisma and PostgreSQL.

