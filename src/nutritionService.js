const foodDb = {
  // 🥗 VEGETARIAN
  paneer:          { protein: 18, carbs: 1.2, fat: 20,  calories: 265, quantity: '100g serving', emoji: '🧀', diet: 'vegetarian', info: 'Rich in casein protein for slow release.', bestTime: 'Dinner, Lunch', restricted: [] },
  'soya-chunks':   { protein: 52, carbs: 33,  fat: 0.5, calories: 345, quantity: '50g (dry)',    emoji: '🌱', diet: 'vegetarian', info: 'Highest plant protein source.', bestTime: 'Post-Workout, Lunch', restricted: [] },
  dal:             { protein: 9,  carbs: 20,  fat: 0.4, calories: 116, quantity: '1 cup cooked', emoji: '🥣', diet: 'vegetarian', info: 'Essential amino acids and fiber.', bestTime: 'Lunch, Dinner', restricted: [] },
  milk:            { protein: 3.4, carbs: 5,   fat: 1,   calories: 42,  quantity: '250ml glass',  emoji: '🥛', diet: 'both',       info: 'Perfect post-workout or before bed.', bestTime: 'Breakfast, Post-Workout', restricted: [] },
  peanuts:         { protein: 26, carbs: 16,  fat: 49,  calories: 567, quantity: '30g handful',   emoji: '🥜', diet: 'both',       info: 'Healthy fats and protein boost.', bestTime: 'Pre-Workout', restricted: [] },
  oats:            { protein: 16.9, carbs: 66, fat: 6.9, calories: 389, quantity: '80g dry',     emoji: '🥣', diet: 'both',       info: 'Complex carbs for steady energy.', bestTime: 'Breakfast, Pre-Workout', restricted: ['Diabetes'] },
  broccoli:        { protein: 2.8, carbs: 7,   fat: 0.4, calories: 34,  quantity: '150g bowl',    emoji: '🥦', diet: 'both',       info: 'Micronutrients and fiber.', bestTime: 'Lunch, Dinner', restricted: [] },
  tofu:            { protein: 8,   carbs: 1.9, fat: 4.2, calories: 76,  quantity: '150g block',   emoji: '🍱', diet: 'vegetarian', info: 'Complete plant protein.', bestTime: 'Lunch, Dinner', restricted: [] },
  
  // 🍗 NON-VEGETARIAN
  eggs:            { protein: 13,  carbs: 1.1, fat: 11,  calories: 155, quantity: '3 whole eggs', emoji: '🥚', diet: 'non_vegetarian', info: 'Gold standard for bioavailable protein.', bestTime: 'Breakfast', restricted: [] },
  'chicken-breast':{ protein: 31,  carbs: 0,   fat: 3.6, calories: 165, quantity: '200g portion', emoji: '🍗', diet: 'non_vegetarian', info: 'Lean protein for muscle density.', bestTime: 'Lunch, Post-Workout', restricted: [] },
  fish:            { protein: 22,  carbs: 0,   fat: 1.2, calories: 105, quantity: '150g fillet',  emoji: '🐟', diet: 'non_vegetarian', info: 'Omega-3 fatty acids and lean protein.', bestTime: 'Dinner, Lunch', restricted: ['Thyroid'] },
  rice:            { protein: 2.7, carbs: 28,  fat: 0.3, calories: 130, quantity: '150g cooked',  emoji: '🍚', diet: 'both',       info: 'Fast-digesting fuel for recovery.', bestTime: 'Lunch, Post-Workout', restricted: ['Diabetes'] },
  'greek-yogurt':  { protein: 10,  carbs: 3.6, fat: 0.4, calories: 59,  quantity: '150g cup',     emoji: '🍦', diet: 'both',       info: 'Probiotic rich lean protein.', bestTime: 'Breakfast, Snacks', restricted: [] },
  almonds:          { protein: 21,  carbs: 22,  fat: 50,  calories: 579, quantity: '20g handful',  emoji: '🫘', diet: 'both',       info: 'Heart healthy fats and minerals.', bestTime: 'Snack', restricted: [] },
};

export const goalDietFoodMap = {
  vegetarian: {
    bulk:        ['oats', 'milk', 'paneer', 'soya-chunks', 'peanuts', 'greek-yogurt'],
    lean_bulk:   ['oats', 'paneer', 'soya-chunks', 'milk', 'dal', 'greek-yogurt'],
    cut:         ['soya-chunks', 'dal', 'broccoli', 'greek-yogurt', 'tofu'],
    fat_loss:    ['soya-chunks', 'dal', 'broccoli', 'greek-yogurt', 'tofu'],
    tone_body:   ['tofu', 'dal', 'broccoli', 'greek-yogurt', 'milk'],
    maintenance: ['dal', 'milk', 'paneer', 'oats', 'peanuts'],
  },
  non_vegetarian: {
    bulk:        ['eggs', 'chicken-breast', 'rice', 'milk', 'oats', 'fish'],
    lean_bulk:   ['chicken-breast', 'eggs', 'fish', 'rice', 'milk', 'greek-yogurt'],
    cut:         ['chicken-breast', 'fish', 'eggs', 'broccoli', 'greek-yogurt'],
    fat_loss:    ['fish', 'chicken-breast', 'eggs', 'broccoli', 'greek-yogurt'],
    tone_body:   ['chicken-breast', 'fish', 'eggs', 'broccoli', 'milk'],
    maintenance: ['eggs', 'chicken-breast', 'fish', 'rice', 'milk'],
  },
};

export const mealFoodMap = {
  vegetarian: {
    Breakfast:      ['greek-yogurt', 'oats', 'milk'],
    Lunch:          ['dal', 'paneer', 'tofu'],
    'Pre-Workout':  ['peanuts', 'oats'],
    'Post-Workout': ['soya-chunks', 'milk'],
    Dinner:         ['dal', 'tofu', 'broccoli'],
  },
  non_vegetarian: {
    Breakfast:      ['eggs', 'milk', 'greek-yogurt'],
    Lunch:          ['chicken-breast', 'rice', 'fish'],
    'Pre-Workout':  ['oats', 'milk'],
    'Post-Workout': ['chicken-breast', 'rice'],
    Dinner:         ['fish', 'broccoli'],
  },
};

export const getMealPlan = (userData) => {
  const { proteinTarget, diet, healthCondition = 'None' } = userData;
  const dietKey = diet === 'non_vegetarian' ? 'non_vegetarian' : 'vegetarian';
  
  const distribution = [0.20, 0.25, 0.16, 0.23, 0.16];
  const mealNames = [
    { name: 'Breakfast',     time: '08:00 AM', purpose: 'Morning Protein Spike', icon: '🌅' },
    { name: 'Lunch',         time: '01:00 PM', purpose: 'Energy for Afternoon', icon: '☀️' },
    { name: 'Pre-Workout',   time: '45–60m Before', purpose: 'Muscle Performance', icon: '⚡' },
    { name: 'Post-Workout',  time: 'within 30m After', purpose: 'Recovery Initiation', icon: '💪' },
    { name: 'Dinner',        time: '08:00 PM', purpose: 'Overnight Rebuild', icon: '🌙' },
  ];

  return mealNames.map((m, i) => {
    const mealFoods = (mealFoodMap[dietKey][m.name] || ['oats']).filter(k => {
        const f = foodDb[k];
        return !f.restricted.includes(healthCondition);
    });
    
    const foodKey = mealFoods[0] || 'milk';
    const food = foodDb[foodKey];
    
    const targetProtein = Math.round(proteinTarget * distribution[i]);
    const servingSize = Math.round((targetProtein / food.protein) * 100);

    return {
      ...m,
      protein: targetProtein,
      calories: Math.round((food.calories / 100) * servingSize),
      carbs: Math.round((food.carbs / 100) * servingSize),
      fat: Math.round((food.fat / 100) * servingSize),
      food: foodKey.replace('-', ' '),
      explanation: `${food.info} Serving: roughly ${servingSize}g. Adjusted for ${healthCondition}.`,
      foodDetails: { ...food, name: foodKey, image: `/foods/${foodKey}.png` }
    };
  });
};

export const getRecommendedFoods = (diet, goalId, healthCondition = 'None') => {
  const keys = goalDietFoodMap[diet]?.[goalId] || goalDietFoodMap['vegetarian']['maintenance'];
  
  return keys
    .filter(k => !foodDb[k].restricted.includes(healthCondition))
    .map(key => {
        const entry = foodDb[key];
        return {
            name: key.replace('-', ' '),
            image: `/foods/${key}.png`,
            ...entry,
        };
    });
};

export const fetchFoodNutrition = async (foodName) => {
  const lowerName = foodName.toLowerCase().replace(/\s+/g, '-');
  const entry = foodDb[lowerName];
  if (entry) {
    return { name: foodName, image: `/foods/${lowerName}.png`, ...entry };
  }
  return {
    name: foodName,
    image: `/foods/oats.png`,
    protein: 10, carbs: 10, fat: 5, calories: 125,
    quantity: '100g per serving', emoji: '🍽️',
    info: `Nutrition for 100g of ${foodName}.`,
  };
};
