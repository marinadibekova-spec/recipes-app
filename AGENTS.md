<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Recipe App Agent Context

You are the lead full-stack engineer for this project.

Your responsibility is to maintain a clean, scalable, production-ready Recipe Management Application.

---

# Project Overview

This application allows users to:

* Create recipes
* View recipes
* Edit recipes
* Delete recipes
* Search recipes
* Filter recipes by category

The project follows modern Next.js App Router architecture.

---

# Tech Stack

* Next.js App Router
* JavaScript
* Tailwind CSS
* Prisma ORM
* SQLite
* REST API Route Handlers

---

# Database Schema

Current Recipe model:

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

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

# Data Rules

Ingredients and instructions are stored as JSON strings.

Saving:

```js
JSON.stringify(ingredients)
JSON.stringify(instructions)
```

Reading:

```js
JSON.parse(recipe.ingredients)
JSON.parse(recipe.instructions)
```

Always preserve this behavior unless the database schema changes.

---

# Existing Project Structure

```text
app/
├── api/
│   └── recipes/
│       ├── route.js
│       └── [id]/
│           └── route.js
│
├── recipes/
│   ├── page.js
│   └── new/
│       └── page.js
│
lib/
└── prisma.js

prisma/
└── schema.prisma
```

---

# Completed Features

✅ Prisma setup

✅ SQLite database

✅ Recipe model

✅ GET /api/recipes

✅ POST /api/recipes

✅ GET /api/recipes/[id]

✅ PUT /api/recipes/[id]

✅ DELETE /api/recipes/[id]

✅ Add Recipe page

✅ Recipes list page

---

# Upcoming Features

1. Recipe Details Page

```text
app/recipes/[id]/page.js
```

2. Edit Recipe Page

```text
app/recipes/[id]/edit/page.js
```

3. Delete Recipe Button

4. Search Recipes

5. Category Filters

6. Reusable Components

```text
components/
├── RecipeCard.jsx
├── RecipeForm.jsx
├── Navbar.jsx
├── EmptyState.jsx
└── LoadingState.jsx
```

7. Authentication

8. Image Upload

---

# Coding Standards

## General

* Use modern JavaScript.
* Prefer readability over clever code.
* Use async/await.
* Avoid duplicated code.
* Keep files under 250 lines when possible.
* Extract reusable UI into components.

---

## Next.js

* Use Server Components by default.
* Use Client Components only when state or browser APIs are needed.
* Use Next.js Link for navigation.
* Use notFound() when resources do not exist.
* Use Route Handlers for API endpoints.

---

## Prisma

Always import Prisma like this:

```js
import prisma from "@/lib/prisma";
```

Never create additional Prisma clients.

Always use:

```js
try {
  // database logic
} catch (error) {
  // error handling
}
```

---

## API Design

All API routes should:

* Validate input
* Return proper HTTP status codes
* Handle errors gracefully
* Return JSON responses
* Include helpful error messages

Preferred response format:

```js
{
  success: true,
  data: ...
}
```

or

```js
{
  success: false,
  error: "Description"
}
```

---

# UI Design System

## Style

* Modern SaaS style
* Mobile-first
* Clean spacing
* Responsive layouts

## Components

* rounded-2xl or rounded-3xl
* subtle shadows
* hover effects
* accessible forms

## Colors

Primary:

* Indigo

Secondary:

* Slate

Background:

* Slate 50

Cards:

* White

---

# Comment Style

Use comments for major sections only.

Example:

```js
/**
 * GET /api/recipes
 * Fetch all recipes
 */
```

and

```js
// Validate route parameter
// Fetch recipe from database
// Return success response
```

Avoid commenting every single line.

---

# Expectations

Before generating code:

1. Reuse existing files when possible.
2. Respect the current architecture.
3. Prefer consistency over introducing new patterns.
4. Do not change the database schema without a clear reason.
5. Keep the application production-ready and maintainable.
