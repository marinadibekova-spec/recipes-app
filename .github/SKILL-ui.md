# Recipe App UI Engineering Skill

## Overview

This skill guides the creation of modern, production-ready UI components and pages for the Recipe Manager application.

It ensures consistency in design, accessibility, responsiveness, and code quality across all user-facing interfaces.

---

## Project Context

* Framework: Next.js App Router
* UI: React
* Styling: Tailwind CSS
* Data layer: Prisma ORM
* Database: PostgreSQL
* Preferred UI mutations: Server Actions and HTML forms
* Component style: clean, reusable, mobile-first

---

## Goals

* Modern SaaS-style design
* Mobile-first responsive layouts
* Tailwind CSS only
* No external UI libraries unless explicitly requested
* Card-based reusable interfaces
* Accessible forms with proper labels
* Clear empty, loading, and error states
* Consistent spacing and typography
* Server-first UI patterns where possible

---

## Current UI Architecture

The project uses Server Components by default.

Client Components should only be used when browser APIs, local state, or client-only interactivity are truly required.

Important user actions currently use Server Actions instead of client-side `onClick` or `onSubmit`.

Current server-action UI components include:

```text id="ixhp8j"
components/CreateRecipeForm.jsx
components/EditRecipeForm.jsx
components/RecipeActionButtons.jsx
```

Filtering uses a standard HTML GET form:

```text id="g3qyoq"
components/RecipeFilters.jsx
```

Do not replace these working server-side patterns with client-side fetch logic unless there is a clear reason.

---

## Color Palette

| Purpose    | Colors                          | Usage                           |
| ---------- | ------------------------------- | ------------------------------- |
| Primary    | Indigo 600, Indigo 700          | CTA buttons, accents, links     |
| Secondary  | Slate 700, Slate 600, Slate 500 | Text, labels, secondary actions |
| Background | Slate 50                        | Page backgrounds                |
| Cards      | White                           | Card surfaces, form containers  |
| Borders    | Slate 200                       | Dividers, input borders         |
| Focus      | Indigo 100, Indigo 500          | Focus rings and focus borders   |
| Status     | Red 50, Red 200, Red 700        | Error states                    |

---

## Design System Components

### Primary Button

```html id="zwsi5p"
<button class="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
  Action
</button>
```

### Secondary Button

```html id="gqoec0"
<button class="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
  Secondary
</button>
```

### Danger Button

```html id="iabjia"
<button class="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700">
  Delete
</button>
```

### Text Input

```html id="cesek2"
<label class="block">
  <span class="mb-2 block text-sm font-medium text-slate-700">Label</span>
  <input
    type="text"
    class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  />
</label>
```

### Textarea

```html id="x7fv2a"
<label class="block">
  <span class="mb-2 block text-sm font-medium text-slate-700">Label</span>
  <textarea
    class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
  ></textarea>
</label>
```

### Select

```html id="il7k4c"
<select class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
  <option>Select option</option>
</select>
```

### Card Container

```html id="xdyevm"
<div class="rounded-3xl bg-white p-6 shadow-sm">
  <!-- content -->
</div>
```

### Empty State

```html id="ps7k8t"
<div class="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
  <h2 class="text-xl font-medium text-slate-900">No items yet</h2>
  <p class="mt-2 text-sm text-slate-500">Description of what to do next.</p>
  <div class="mt-6">
    <a href="..." class="inline-flex items-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
      Create first item
    </a>
  </div>
</div>
```

---

## Current Reusable Components

### PageHeader

Used for page titles, subtitles, and optional action links.

Expected props:

```text id="fkqahy"
title
description
actionLabel
actionHref
```

Use it at the top of major pages.

---

### RecipeCard

Displays a recipe summary in the recipe grid.

Expected features:

* image or fallback placeholder
* title
* category
* description fallback
* preparation time
* servings
* favorite state indicator if available
* link to recipe details

---

### CreateRecipeForm

Server-side form for creating recipes.

Uses a Server Action.

Fields:

* title
* description
* ingredients
* instructions
* image URL
* category
* preparation time
* servings

Important rules:

* ingredients are entered one per line
* instructions are entered one per line
* multiline text is converted to JSON strings before saving
* empty optional fields become `null`
* redirect to `/recipes` after success
* revalidate `/recipes` after success

---

### EditRecipeForm

Server-side form for editing existing recipes.

Uses a Server Action.

Important rules:

* pre-fill fields with `defaultValue`
* parse stored JSON strings into multiline text
* convert updated multiline text back into JSON strings
* revalidate `/recipes`
* revalidate `/recipes/[id]`
* redirect to the recipe details page after success

---

### RecipeActionButtons

Server-side action component for recipe-level actions.

Expected actions:

* toggle favorite
* edit link
* delete recipe

Important rules:

* favorite and delete use Server Actions
* edit uses `Link`
* delete currently performs direct delete and redirects to `/recipes`
* keep actions grouped in a clean button row

---

### RecipeFilters

Server-side-friendly filter form.

Important rules:

* use regular `<form method="GET" action="/recipes">`
* do not use client-side router state
* preserve selected values with `defaultValue` and `defaultChecked`
* supported query params:

  * `search`
  * `category`
  * `favorite`
  * `sort`
  * `page`

---

### EmptyState

Fallback UI when no recipes match current filters or no recipes exist.

Expected props:

```text id="gx33ql"
title
description
actionLabel
actionHref
```

---

### Navbar

Main navigation component.

Expected links:

* Home
* Recipes
* Add Recipe

Use a clean sticky or top navigation layout.

---

## Workflow: Creating a New Page

### 1. Use a Server Component by Default

```jsx id="u5m1le"
export default async function MyPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* content */}
      </div>
    </div>
  );
}
```

### 2. Fetch Data with Prisma in Server Components

```jsx id="ujc10e"
import prisma from "@/lib/prisma";

const recipes = await prisma.recipe.findMany({
  orderBy: { createdAt: "desc" },
});
```

Do not fetch internal API routes from Server Components.

### 3. Use PageHeader

```jsx id="uxskra"
<PageHeader
  title="Recipes"
  description="Browse and manage your recipe collection."
  actionLabel="+ Add Recipe"
  actionHref="/recipes/new"
/>
```

### 4. Build Responsive Layouts

Use mobile-first grid classes:

```html id="9hg5xs"
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  <!-- cards -->
</div>
```

### 5. Add Empty State

If no data exists, render `EmptyState`.

### 6. Extract Components

Extract repeated UI into `components/`.

Avoid very large page files when possible.

---

## Workflow: Creating a Server Action Form

Use Server Action forms for core database mutations.

```jsx id="ej335u"
export default function ExampleForm() {
  async function saveItem(formData) {
    "use server";

    // validate input
    // save with Prisma
    // revalidate paths
    // redirect if needed
  }

  return (
    <form action={saveItem} className="rounded-3xl bg-white p-6 shadow-sm">
      {/* fields */}
    </form>
  );
}
```

### Form Rules

* use `name` attributes on inputs
* use `required` where appropriate
* use `defaultValue` for edit forms
* use `defaultChecked` for checkboxes
* use labels for every input
* use visible focus states
* use semantic submit buttons
* use readable text color such as `text-slate-900`

---

## Workflow: Creating a Filter Form

Use a regular GET form.

```jsx id="igto0p"
<form action="/recipes" method="GET">
  <input name="search" defaultValue={search} />
  <select name="category" defaultValue={category}>
    <option value="">All categories</option>
  </select>
  <button type="submit">Apply Filter</button>
</form>
```

Avoid client-side filtering controls unless specifically needed.

---

## Common Layout Patterns

### Page Container

```html id="z4b4gy"
<div class="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-7xl space-y-8">
    <!-- content -->
  </div>
</div>
```

### Two Column Detail Layout

```html id="xv0cin"
<div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
  <div class="space-y-8">
    <!-- main content -->
  </div>
  <div class="space-y-8">
    <!-- side content -->
  </div>
</div>
```

### Button Row

```html id="k74jo2"
<div class="flex flex-wrap items-center gap-3">
  <!-- actions -->
</div>
```

### Responsive Card Grid

```html id="dkq3eq"
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  <!-- cards -->
</div>
```

---

## Accessibility Rules

* Use semantic HTML.
* Use one main `<h1>` per page.
* Use clear labels for all form fields.
* Use `type="submit"` for submit buttons.
* Use `type="button"` for non-submit buttons.
* Keep visible focus states.
* Keep good color contrast.
* Do not rely only on color for errors.
* Use descriptive link and button text.

---

## Image Rules

Use `next/image` on server-rendered recipe pages.

Always provide:

* `src`
* `alt`
* sizing strategy such as `fill` with `sizes`

Show a fallback placeholder when no image exists.

---

## Best Practices

Do:

* use Server Components by default
* use Server Actions for mutations
* use HTML GET forms for filters
* extract reusable components
* keep UI consistent
* use Tailwind utility classes
* keep forms accessible
* keep text readable with `text-slate-900`
* use empty and fallback states

Do not:

* use inline styles
* use external UI libraries unless requested
* create monolithic pages
* duplicate JSX structures
* ignore mobile responsiveness
* remove working Server Action flows
* replace simple forms with unnecessary client-side state

---

## Quality Checklist

Before finishing a UI component or page:

* [ ] Mobile responsive
* [ ] Color contrast is readable
* [ ] Forms have labels
* [ ] Inputs have visible focus states
* [ ] User-entered text is not too faint
* [ ] Empty states are handled
* [ ] Error states are visible where applicable
* [ ] No inline styles
* [ ] Reusable UI is extracted
* [ ] Consistent spacing and rounded corners
* [ ] Interactive elements use semantic buttons or links
* [ ] Server Actions revalidate or redirect correctly
* [ ] Filters use GET query parameters

---

## Example Prompts

Use this skill for prompts such as:

* "Create a responsive recipe details page with ingredients and instructions."
* "Build a server-action form for adding a recipe."
* "Update the edit recipe form to use default values and save through Prisma."
* "Create a filter form that uses URL query parameters."
* "Improve the RecipeCard layout with image fallback and metadata."
* "Review this page for Tailwind consistency and accessibility."

---

## Guiding Principle

The UI should be clean, accessible, responsive, and consistent with the existing Recipe Manager architecture.

Prefer server-first patterns, simple forms, reusable components, and Tailwind CSS utilities that already match the project design.

