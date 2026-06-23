# Recipe Manager

Recipe Manager is a full-stack web application for creating, organizing, editing, and managing personal recipes. The application allows users to store recipe details, browse their collection, filter recipes by category or search term, mark favorite recipes, and view detailed cooking instructions in a clean and responsive interface.

The project was built with Next.js App Router, Prisma ORM, PostgreSQL, and Tailwind CSS. It focuses on practical recipe management with a simple user experience and reliable server-side data handling.

---

## Features

* Create new recipes
* View all recipes in a responsive grid layout
* Open a detailed page for each recipe
* Edit existing recipes
* Delete recipes
* Mark and unmark favorite recipes
* Filter recipes by search term, category, favorite status, and sorting option
* Store ingredients and instructions as structured lists
* Display recipe images from remote URLs
* View preparation time, servings, category, and description
* Server-side database operations with Prisma
* Responsive design with Tailwind CSS

---

## Tech Stack

### Frontend

* Next.js App Router
* React
* Tailwind CSS
* Server Components
* Server Actions
* Reusable UI components

### Backend

* Next.js Route Handlers
* Prisma ORM
* PostgreSQL
* REST-style API routes

### Development Tools

* GitHub Copilot
* ChatGPT
* Vercel
* Prisma CLI

---

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* PostgreSQL database
* Git

---

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd recipe-manager
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
DATABASE_URL="your-postgresql-connection-string"
```

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

Open the application in the browser:

```text
http://localhost:3000
```

---

## Main Pages

### Home Page

The home page gives a quick overview of the recipe collection, including total recipes, favorite recipes, available categories, and the latest added recipe.

### Recipes Page

The recipes page displays all saved recipes in a responsive card layout. Users can search, filter, sort, and browse recipes.

### Recipe Details Page

The details page displays a single recipe with its image, description, category, preparation time, servings, ingredients, and instructions.

### Add Recipe Page

The add page contains a server-side form for creating a new recipe. The form supports title, description, ingredients, instructions, image URL, category, preparation time, and servings.

### Edit Recipe Page

The edit page allows users to update existing recipe information using a server-side form.

---

## API Routes

The project includes API routes for recipe management.

### Recipes Collection

```text
GET /api/recipes
POST /api/recipes
```

### Single Recipe

```text
GET /api/recipes/[id]
PUT /api/recipes/[id]
DELETE /api/recipes/[id]
```

These routes support retrieving, creating, updating, and deleting recipes.

---

## Styling

The interface is styled with Tailwind CSS. The design focuses on:

* clean layout
* rounded cards
* readable forms
* responsive grids
* simple navigation
* consistent spacing and typography

---

## Deployment

The project is prepared for deployment on Vercel.

Before deploying, make sure the production environment contains the correct database variable:

```env
DATABASE_URL="your-production-postgresql-url"
```

Then deploy through Vercel and ensure that Prisma is generated during the build process.

---

## Development Notes

This is a single-user recipe management application. It does not include authentication or user accounts.

The current version focuses on core CRUD functionality, filtering, favorites, and a polished user interface.

---

## Future Improvements

Possible future improvements include:

* user authentication
* image upload support
* recipe ratings
* meal planning
* shopping list generation
* AI recipe suggestions
* advanced category management
* nutrition information
* public recipe sharing

---

## Project Goal

The goal of Recipe Manager is to provide a simple and useful tool for storing and managing recipes. The project also demonstrates full-stack development with modern Next.js, Prisma, PostgreSQL, and AI-assisted development workflows.
