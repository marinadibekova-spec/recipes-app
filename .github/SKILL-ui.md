# Recipe App UI Engineering Skill

## Overview

This skill guides the creation of modern, production-ready UI components and pages for the Recipe Management Application. It ensures consistency in design, accessibility, responsiveness, and code quality across all user-facing interfaces.

## Goals

- **Modern SaaS Design:** Clean, professional interfaces with subtle shadows and smooth interactions
- **Mobile-First Responsive:** Works seamlessly on mobile, tablet, and desktop
- **Tailwind CSS Only:** No inline styles, no external component libraries
- **Card-Based Interfaces:** Modular, reusable card layouts
- **Accessible Forms:** Proper labels, validation feedback, semantic HTML
- **Consistent Spacing:** Predictable, grid-based spacing system
- **Reusable Components:** DRY principle — extract repeated UI patterns

## Color Palette

| Purpose | Colors | Usage |
|---------|--------|-------|
| Primary | Indigo 600, 700 | CTA buttons, accents, links |
| Secondary | Slate 700, 600, 500 | Text, labels, secondary actions |
| Background | Slate 50 | Page backgrounds |
| Cards | White | Card surfaces, form containers |
| Borders | Slate 200 | Dividers, input borders |
| Status | Red 50/200/700 | Error states |

## Design System Components

### Buttons

**Primary Button (CTA):**
```html
<button class="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition disabled:bg-slate-400">
  Action
</button>
```

**Secondary Button:**
```html
<button class="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
  Secondary
</button>
```

### Form Inputs

**Text/Textarea Input:**
```html
<label class="block">
  <span class="text-sm font-medium text-slate-700">Label</span>
  <input type="text" placeholder="..." class="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
</label>
```

### Cards

**Card Container:**
```html
<div class="rounded-2xl bg-white p-5 shadow-sm hover:shadow-lg transition">
  <!-- content -->
</div>
```

**Card with Header:**
```html
<div class="overflow-hidden rounded-[32px] bg-white shadow-lg">
  <div class="bg-gradient-to-r from-indigo-600 to-sky-500 px-8 py-10">
    <h1 class="text-3xl font-semibold text-white">Title</h1>
  </div>
  <div class="px-6 py-8">
    <!-- content -->
  </div>
</div>
```

### Empty State

```html
<div class="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
  <h2 class="text-xl font-medium text-slate-900">No items yet</h2>
  <p class="mt-2 text-sm text-slate-500">Description of what to do next.</p>
  <div class="mt-6">
    <a href="..." class="inline-flex rounded-2xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
      Create first item
    </a>
  </div>
</div>
```

## Reusable Components

### RecipeCard

Displays recipe summary in grid layout.

**Props:**
- `recipe: Object` — Recipe data (id, title, category, description, preparationTime, servings, createdAt)

**Features:**
- Title and category display
- Description with optional fallback
- Meta info: preparation time, servings
- Action links: View, Edit
- Created date in footer

**Usage:**
```jsx
<RecipeCard recipe={recipe} />
```

### RecipeForm

Form for adding/editing recipes.

**Props:**
- `initialData?: Object` — For edit mode; if null, add mode
- `onSubmit: Function` — Callback on form submission

**Fields:**
- Title (required)
- Description
- Category
- Preparation time (number)
- Servings (number)
- Image URL
- Ingredients (textarea, one per line)
- Instructions (textarea, one per line)

**Features:**
- Client component with state management
- Input validation
- Loading state while submitting
- Error messaging
- Line-by-line input converted to JSON arrays

### EmptyState

Fallback UI when no data exists.

**Props:**
- `title: string` — Heading
- `description: string` — Supporting text
- `ctaLabel: string` — Button text
- `ctaHref: string` — Link destination

**Features:**
- Dashed border container
- Centered layout
- Clear call-to-action
- Icon optional

### Navbar

Header navigation component.

**Props:**
- `title?: string` — App/section title
- `actions?: Array` — Navigation links or buttons

**Features:**
- Sticky or fixed positioning
- Logo/title on left
- Navigation/actions on right
- Mobile hamburger menu (if needed)
- Responsive spacing

## Workflow: Creating a New Page

### 1. Plan Layout

- Sketch container structure (header, content, footer)
- Identify card/section boundaries
- Define breakpoints (mobile, tablet, desktop)

### 2. Set Up Server Component

```jsx
export default async function MyPage() {
  // Fetch data if needed
  const data = await prisma.model.findMany()

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* content */}
    </div>
  )
}
```

### 3. Build Grid Layout

- Use `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` for responsive grids
- Gap: `gap-6` for consistent spacing
- Mobile-first: base → sm → lg

### 4. Create Cards

- Use `rounded-2xl bg-white p-5 shadow-sm hover:shadow-lg`
- Group related content inside
- Add actions (View, Edit, Delete) in consistent positions

### 5. Add Empty State

- Check if data exists
- Render fallback UI with clear CTA
- Link to creation page

### 6. Extract Reusable Components

- If card logic repeats, create `RecipeCard.jsx` in `components/`
- If form logic repeats, create `RecipeForm.jsx` in `components/`
- Keep components focused and prop-based

### 7. Accessibility & Responsive Checks

- ✅ Semantic HTML: `<label>`, `<button>`, headings
- ✅ Color contrast: Text readable on backgrounds
- ✅ Mobile: Test on small screens (320px+)
- ✅ Focus states: Inputs have visible focus rings
- ✅ Error messages: Not color-only; include text

## Workflow: Creating a Form

### 1. Determine Mode

- **Add Mode:** Empty initial state
- **Edit Mode:** Pre-filled with existing data

### 2. Use Client Component

```jsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MyForm({ initialData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // ... field states
}
```

### 3. Manage Form State

- Use `useState` for each field or single object state
- Trim text inputs
- Convert strings to numbers where needed
- Validate before submission

### 4. Handle Submission

```js
const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  // Validate
  if (!title.trim()) {
    setError('Title is required.')
    return
  }

  setLoading(true)

  try {
    const response = await fetch('/api/endpoint', {
      method: initialData ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...})
    })

    if (!response.ok) throw new Error('Failed')

    router.push('/next-page')
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

### 5. Render Form Layout

- **Card container:** `rounded-[32px] bg-white shadow-lg`
- **Header:** Gradient background with title/description
- **Form body:** `px-6 py-8` with `space-y-6` between fields
- **Error box:** Red 50 background with red 700 text
- **Button row:** Action buttons on right side

### 6. Validation & Feedback

- Show field-level errors
- Disable submit while loading
- Show "Saving..." state
- Display success/error messages

## Common Patterns

### Grid Layout

```html
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  <!-- cards -->
</div>
```

### Spacing Container

```html
<div class="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-7xl">
    <!-- content -->
  </div>
</div>
```

### Header + Content

```html
<div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div>
    <h1 class="text-3xl font-semibold text-slate-900">Title</h1>
    <p class="mt-1 text-sm text-slate-500">Subtitle</p>
  </div>
  <button>Action</button>
</div>
```

### Responsive Grid Columns

```html
<div class="grid gap-6 lg:grid-cols-2">
  <!-- Stacks on mobile, 2 cols on large -->
</div>
```

## Best Practices

✅ **Do:**
- Extract repeating card/form patterns into components
- Use Tailwind utility classes consistently
- Mobile-first responsive design
- Include error states and empty states
- Add comments for section headers
- Use semantic HTML tags

❌ **Don't:**
- Use inline `style=` attributes
- Create monolithic pages over 250 lines
- Duplicate JSX structure
- Ignore mobile responsiveness
- Forget accessibility (labels, focus, contrast)
- Use external component libraries

## Quality Checklist

Before finishing a UI component or page:

- [ ] Mobile responsive (test at 320px, 768px, 1024px)
- [ ] Color contrast passes (AA standard)
- [ ] Forms have proper labels and focus states
- [ ] Empty states display clearly
- [ ] Loading and error states visible
- [ ] No inline styles
- [ ] Extracted reusable components
- [ ] Comments on major sections
- [ ] Page under 250 lines (if not, extract components)
- [ ] Consistent spacing and rounding
- [ ] Hover effects on interactive elements

## Example Prompts

**"Create a recipe detail page that shows a single recipe with ingredients parsed from JSON, edit and delete buttons, and a back link."**

**"Build a reusable RecipeCard component that displays title, category, prep time, servings, and has view/edit links."**

**"Design an empty state component for when no recipes exist, with a call-to-action button linking to the add recipe page."**

**"Create a responsive form for editing recipes with all fields, JSON parsing for ingredients/instructions, and proper error handling."**

## Related Skills & Customizations

- **API Integration:** Create skill for API route development patterns
- **Database Queries:** Skill for Prisma query patterns
- **Mobile Optimization:** Advanced responsive design checklist
- **Accessibility Audit:** WCAG compliance checklist
