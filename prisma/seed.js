import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const demoRecipes = [
  {
    title: 'Classic Pancakes',
    description: 'Fluffy breakfast pancakes with a golden finish and soft center.',
    ingredients: JSON.stringify([
      '2 cups all-purpose flour',
      '2 tablespoons sugar',
      '2 teaspoons baking powder',
      '2 eggs',
      '1 1/2 cups milk',
      '2 tablespoons melted butter',
    ]),
    instructions: JSON.stringify([
      'Whisk the dry ingredients together in a large bowl.',
      'Mix eggs, milk, and melted butter in a separate bowl.',
      'Combine wet and dry ingredients until just mixed.',
      'Cook batter on a hot greased skillet until bubbles form, then flip.',
      'Serve warm with maple syrup or fresh fruit.',
    ]),
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80',
    category: 'Breakfast',
    preparationTime: 20,
    servings: 4,
    isFavorite: true,
  },
  {
    title: 'Mediterranean Chickpea Salad',
    description: 'A bright and filling salad with herbs, lemon, and crunchy vegetables.',
    ingredients: JSON.stringify([
      '2 cans chickpeas, drained',
      '1 cucumber, diced',
      '1 cup cherry tomatoes, halved',
      '1/2 red onion, thinly sliced',
      '1/4 cup parsley, chopped',
      '3 tablespoons olive oil',
      '1 lemon, juiced',
    ]),
    instructions: JSON.stringify([
      'Add chickpeas, cucumber, tomatoes, onion, and parsley to a large bowl.',
      'Whisk olive oil and lemon juice together in a small bowl.',
      'Pour dressing over the salad and toss well.',
      'Season to taste and chill briefly before serving.',
    ]),
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
    category: 'Salad',
    preparationTime: 15,
    servings: 4,
    isFavorite: false,
  },
  {
    title: 'Creamy Tomato Pasta',
    description: 'Comforting pasta in a silky tomato sauce with garlic and basil.',
    ingredients: JSON.stringify([
      '12 oz pasta',
      '2 tablespoons olive oil',
      '3 cloves garlic, minced',
      '1 can crushed tomatoes',
      '1/2 cup heavy cream',
      '1/4 cup grated parmesan',
      'Fresh basil leaves',
    ]),
    instructions: JSON.stringify([
      'Cook the pasta until al dente and reserve some pasta water.',
      'Saute garlic in olive oil until fragrant.',
      'Add crushed tomatoes and simmer for 10 minutes.',
      'Stir in cream and parmesan until the sauce is smooth.',
      'Toss the pasta with sauce and basil, adding pasta water if needed.',
    ]),
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80',
    category: 'Dinner',
    preparationTime: 30,
    servings: 4,
    isFavorite: true,
  },
  {
    title: 'Roasted Vegetable Soup',
    description: 'A hearty blended soup with roasted carrots, squash, and warm spices.',
    ingredients: JSON.stringify([
      '4 carrots, chopped',
      '1 small butternut squash, cubed',
      '1 onion, quartered',
      '3 tablespoons olive oil',
      '4 cups vegetable broth',
      '1/2 teaspoon smoked paprika',
      'Salt and pepper to taste',
    ]),
    instructions: JSON.stringify([
      'Roast carrots, squash, and onion with olive oil until tender.',
      'Transfer roasted vegetables to a pot with vegetable broth.',
      'Add smoked paprika and simmer for 10 minutes.',
      'Blend until smooth and season to taste.',
      'Serve hot with crusty bread.',
    ]),
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    category: 'Soup',
    preparationTime: 45,
    servings: 6,
    isFavorite: false,
  },
  {
    title: 'Chocolate Berry Parfaits',
    description: 'Layered dessert parfaits with whipped cream, berries, and chocolate crumble.',
    ingredients: JSON.stringify([
      '2 cups mixed berries',
      '1 cup whipped cream',
      '1/2 cup chocolate cookie crumbs',
      '1/4 cup dark chocolate shavings',
      '2 tablespoons honey',
    ]),
    instructions: JSON.stringify([
      'Toss berries with honey in a small bowl.',
      'Layer cookie crumbs, whipped cream, and berries in serving glasses.',
      'Repeat layers until the glasses are full.',
      'Top with chocolate shavings and chill before serving.',
    ]),
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
    category: 'Dessert',
    preparationTime: 10,
    servings: 2,
    isFavorite: true,
  },
]

async function main() {
  await prisma.recipe.createMany({
    data: demoRecipes,
  })
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
