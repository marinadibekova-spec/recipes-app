# Copilot Instructions for Recipe Manager

## Project Overview

This is a full-stack Recipe Manager application built with modern Next.js App Router architecture.

The application allows users to:

* create recipes
* view all recipes
* view recipe details
* edit recipes
* delete recipes
* mark recipes as favorites
* search recipes
* filter recipes by category
* filter favorite recipes
* sort recipes
* browse recipes with pagination

---

## Tech Stack

* Framework: Next.js App Router
* UI: React
* Main language: JavaScript
* Selected project files: TypeScript
* Database: PostgreSQL
* ORM: Prisma
* Styling: Tailwind CSS
* Deployment: Vercel
* Data access: Prisma queries, Route Handlers, and Server Actions

---

## Core Rules

* Use Server Components by default.
* Use Client Components only when local state, browser APIs, or client-only interactivity are required.
* Prefer Server Actions and HTML forms for important database mutations.
* Use async/await.
* Prefer readable, simple code over clever code.
* Use Tailwind CSS utilities for styling.
* Use `next/link` for internal navigation.
* Use `notFound()` when a resource does not exist.
* Avoid unnecessary client-side JavaScript.

---

## Next.js Version Rule

This project uses a recent version of Next.js with behavior that may differ from older examples.

Before changing code related to routing, params, route handlers, forms, or server actions, check the local Next.js docs when needed:

```text id="yi5il6"
node_modules/next/dist/docs/
```

Dynamic route `params` may need to be awaited depending on the file and current Next.js version.

---

## Prisma Rules

Always import Prisma like this:

```js id="9zu7h9"
import prisma from "@/lib/prisma";
```

Never create additional Prisma clients.

Use the shared Prisma singleton in:

```text id="pnw9dv"
lib/prisma.ts
```

Use direct Prisma queries in Server Components instead of fetching internal API routes.

Wrap database operations in `try/catch` inside API Route Handlers.

Do not change the Prisma datasource provider without a clear reason.

The current database provider is PostgreSQL.

---

## Recipe Data Rules

Ingredients and instructions are stored as JSON strings in the database.

When saving:

```js id="hpi4gp"
JSON.stringify(ingredients);
JSON.stringify(instructions);
```

When reading:

```js id="1cm1ca"
JSON.parse(recipe.ingredients);
JSON.parse(recipe.instructions);
```

Support both arrays and JSON strings in API routes when possible.

Each ingredient should be one array item.

Each instruction step should be one array item.

---

## API Route Conventions

Use this response format for successful responses:

```js id="8e63ui"
{
  success: true,
  data: ...
}
```

Use this response format for errors:

```js id="8ixml9"
{
  success: false,
  error: "Description",
  details: "Optional details"
}
```

Use proper HTTP status codes:

* 200 for successful GET, PUT, DELETE
* 201 for successful POST
* 400 for validation errors
* 404 for missing resources
* 500 for server errors

Always validate user input before Prisma operations.

Do not expose sensitive internal errors to users.

---

## Server Actions

Server Actions are preferred for important form-based mutations in the UI.

Use Server Actions for:

* creating recipes
* editing recipes
* toggling favorite status
* deleting recipes

Current server-action components include:

```text id="p4zlyg"
components/CreateRecipeForm.jsx
components/EditRecipeForm.jsx
components/RecipeActionButtons.jsx
```

Do not replace these working Server Action flows with client-side `onSubmit` or `onClick` unless there is a clear reason.

---

## Filtering Rules

Recipe filtering uses a standard HTML GET form, not client-side router state.

Current filter component:

```text id="xz5wk6"
components/RecipeFilters.jsx
```

Supported query parameters:

```text id="m8nivb"
search
category
favorite
sort
page
```

The recipes page should pass current search params into the filter component so selected values remain visible after filtering.

---

## UI Design Guidelines

Use a modern SaaS-style UI:

* Background: `bg-slate-50`
* Cards: `bg-white`
* Primary color: Indigo
* Secondary color: Slate
* Rounded corners: `rounded-2xl` or `rounded-3xl`
* Buttons: `rounded-full`
* Subtle shadows
* Hover effects
* Mobile-first responsive design

Prefer custom Tailwind components.

Use external UI libraries only when explicitly requested.

---

## Accessibility

* Use semantic HTML.
* Use labels for form fields.
* Use accessible button text.
* Keep good color contrast.
* Do not rely only on color to communicate errors.
* Use proper heading hierarchy.

---

## Images

Use the Next.js `Image` component when displaying recipe images in server-rendered pages.

Use fallback placeholders when `imageUrl` is missing.

Remote image domains must be configured in:

```text id="h77oyu"
next.config.ts
```

---

## Component Extraction

When JSX exceeds 100 lines or is reused in multiple places:

* Extract it into a reusable component.
* Place reusable UI in `components/`.
* Avoid duplicating card layouts and form layouts.

Current reusable components include:

```text id="u8tx7j"
CreateRecipeForm.jsx
EditRecipeForm.jsx
EmptyState.jsx
Navbar.jsx
PageHeader.jsx
RecipeActionButtons.jsx
RecipeCard.jsx
RecipeFilters.jsx
```

---

## Page Structure

Pages should follow this order:

1. Imports
2. Helper functions
3. Data fetching
4. Validation / `notFound()` handling
5. Main UI
6. Actions / links through reusable components

Keep page components clean and readable.

---

## Comment Style

Use comments for major sections only.

Good examples:

```js id="o6747l"
/**
 * GET /api/recipes
 * Fetch all recipes with optional filters.
 */
```

```js id="ivz7fj"
// Validate input
// Fetch recipe from database
// Return success response
```

Avoid excessive comments on every line.

---

## Code Quality

* Use `const` by default.
* Use `let` only when reassignment is needed.
* Avoid `var`.
* Use descriptive names.
* Keep functions focused on one task.
* Avoid duplicated logic.
* Keep files under 250 lines when possible.
* Keep components readable and easy to maintain.

---

## Development Commands

```bash id="l4y0st"
npm run dev
npm run build
npx prisma studio
npx prisma migrate dev --name <migration-name>
npx prisma generate
```

---

## Guiding Principle

Write code that is clean, consistent, maintainable, accessible, and aligned with the existing Recipe Manager architecture.

Prefer the patterns already working in this project: Server Components, Server Actions, Prisma, Tailwind CSS, and simple HTML forms where possible.

