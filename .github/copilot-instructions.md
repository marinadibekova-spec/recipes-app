# Copilot Instructions for Recipe Management Application

## Project Overview

* Framework: Next.js App Router
* Language: JavaScript
* Database: Prisma ORM with SQLite
* Styling: Tailwind CSS
* API: REST API using Route Handlers

## Core Rules

* Use JavaScript only.
* Use Server Components by default.
* Use `"use client"` only when state, browser APIs, or event handlers are required.
* Use async/await.
* Prefer readable, simple code over clever code.
* Use Tailwind CSS utilities for styling.
* Use `next/link` for internal navigation.
* Use `next/navigation` only for redirects, `notFound()`, or programmatic navigation.

## Prisma Rules

Always import Prisma like this:

```js
import prisma from "@/lib/prisma";
```

Never create additional Prisma clients.

Wrap database operations in try/catch when inside API routes.

Use direct Prisma queries in Server Components instead of fetching internal API routes.

## Recipe Data Rules

Ingredients and instructions are stored as JSON strings in the database.

When saving:

```js
JSON.stringify(ingredients);
JSON.stringify(instructions);
```

When reading:

```js
JSON.parse(recipe.ingredients);
JSON.parse(recipe.instructions);
```

Support both arrays and JSON strings in API routes when possible.

## API Route Conventions

Use this response format:

```js
{
  success: true,
  data: ...
}
```

or:

```js
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

## Server Actions

Prefer Route Handlers for CRUD operations.

Server Actions may be used only when they simplify forms or mutations without adding unnecessary complexity.

## UI Design Guidelines

Use a modern SaaS-style UI:

* Background: `bg-slate-50`
* Cards: `bg-white`
* Primary color: Indigo
* Secondary color: Slate
* Rounded corners: `rounded-2xl` or `rounded-3xl`
* Buttons: `rounded-full` or `rounded-3xl`
* Subtle shadows
* Hover effects
* Mobile-first responsive design

Prefer custom Tailwind components.

Use external UI libraries only when explicitly requested.

## Accessibility

* Use semantic HTML.
* Use labels for form fields.
* Use accessible button text.
* Keep good color contrast.
* Do not rely only on color to communicate errors.
* Use proper heading hierarchy.

## Images

Use the Next.js Image component instead of img whenever possible.

Provide width and height attributes.

Use fallback placeholders when imageUrl is missing.

## Component Extraction

When JSX exceeds 100 lines or is reused in multiple places:

* Extract it into a reusable component.
* Place reusable UI in `components/`.
* Avoid duplicating card layouts and forms.

Preferred reusable components:

* RecipeCard
* RecipeForm
* Navbar
* EmptyState
* LoadingState

## Page Structure

Pages should follow this order:

1. Imports
2. Data fetching
3. Validation / notFound handling
4. Main UI
5. Actions / links

Keep page components clean and readable.

## File Organization

Use this structure:

```text
app/
├── layout.js
├── page.js
├── api/
│   └── recipes/
│       ├── route.js
│       └── [id]/
│           └── route.js
├── recipes/
│   ├── page.js
│   ├── new/
│   │   └── page.js
│   └── [id]/
│       ├── page.js
│       └── edit/
│           └── page.js

components/
├── RecipeCard.jsx
├── RecipeForm.jsx
├── Navbar.jsx
├── EmptyState.jsx
└── LoadingState.jsx

lib/
└── prisma.js

prisma/
└── schema.prisma
```

## Comment Style

Use comments for major sections only.

Good examples:

```js
/**
 * GET /api/recipes
 * Fetch all recipes
 */
```

```js
// Validate input
// Fetch recipe from database
// Return success response
```

Avoid excessive comments on every line.

## Code Quality

* Use `const` by default.
* Use `let` only when reassignment is needed.
* Avoid `var`.
* Use descriptive names.
* Keep functions focused on one task.
* Avoid duplicated logic.
* Keep files under 250 lines when possible.

## Development Commands

```bash
npm run dev
npm run build
npx prisma studio
npx prisma migrate dev --name <migration-name>
npx prisma generate
```

## Guiding Principle

Write code that is clean, consistent, maintainable, accessible, and aligned with the existing Recipe App architecture.
