const foodDb = {
  // 🥗 VEGETARIAN - HIGH PROTEIN
  paneer: { 
    protein: 18, carbs: 1.2, fat: 20, calories: 265, 
    unit: '100g', unitValue: 100, unitProtein: 18, emoji: '🧀', diet: 'vegetarian', 
    category: 'High Protein',
    info: 'Rich in casein protein for slow release.', 
    bestTime: 'Dinner, Lunch', 
    prep: 'Raw / Grilled / Low Oil Curry',
    tips: { fat_loss: 'Prefer raw or grilled.', bulk: 'Great for overnight muscle repair.' },
    restricted: [] 
  },
  'soya-chunks': { 
    protein: 52, carbs: 33, fat: 0.5, calories: 345, 
    unit: '100g', unitValue: 100, unitProtein: 52, emoji: '🌱', diet: 'vegetarian', 
    category: 'High Protein',
    info: 'Highest plant protein source.', 
    bestTime: 'Post-Workout, Lunch', 
    prep: 'Boiled / Soya Bhurji / Curry',
    tips: { fat_loss: 'Boil and add to salads.', bulk: 'Excellent vegan mass builder.' },
    restricted: [] 
  },
  'tofu': { 
    protein: 8, carbs: 1.9, fat: 4.2, calories: 76, 
    unit: '100g', unitValue: 100, unitProtein: 8, emoji: '🍱', diet: 'vegetarian', 
    category: 'High Protein',
    info: 'Complete plant protein.', 
    bestTime: 'Lunch, Dinner', 
    prep: 'Grilled / Sautéed / Tofu Salad',
    tips: { fat_loss: 'Perfect low-calorie meat substitute.', bulk: 'Excellent for vegan protein volume.' },
    restricted: [] 
  },
  'sprouts': { 
    protein: 8, carbs: 15, fat: 1, calories: 100, 
    unit: 'bowl', unitValue: 150, unitProtein: 12, emoji: '🥗', diet: 'vegetarian', 
    category: 'Moderate Protein',
    info: 'Enzyme-rich and easy to digest.', 
    bestTime: 'Breakfast, Snack', 
    prep: 'Raw Salad / Steamed with Lemon',
    tips: { fat_loss: 'Best morning metabolism booster.', bulk: 'Add to meals for fiber.' },
    restricted: [] 
  },

  // 🥣 PULSES & BEANS
  'dal': { 
    protein: 9, carbs: 20, fat: 0.4, calories: 116, 
    unit: 'bowl', unitValue: 150, unitProtein: 13.5, emoji: '🥣', diet: 'vegetarian', 
    category: 'Moderate Protein',
    info: 'Essential amino acids and fiber.', 
    bestTime: 'Lunch, Dinner', 
    prep: 'Classic Dal / Lentil Soup',
    tips: { fat_loss: 'Limit white rice with it.', bulk: 'Double serving for more calories.' },
    restricted: [] 
  },
  'rajma': { 
    protein: 24, carbs: 60, fat: 1.5, calories: 330, 
    unit: 'bowl', unitValue: 150, unitProtein: 12, emoji: '🍛', diet: 'vegetarian', 
    category: 'Moderate Protein',
    info: 'Slow-digesting complex carbs and protein.', 
    bestTime: 'Lunch', 
    prep: 'Rajma Curry (Low Oil) / Salad',
    tips: { fat_loss: 'Limit gravy oil.', bulk: 'Pair with Brown Rice.' },
    restricted: [] 
  },
  'chole': { 
    protein: 19, carbs: 61, fat: 6, calories: 360, 
    unit: 'bowl', unitValue: 150, unitProtein: 11, emoji: '🥘', diet: 'vegetarian', 
    category: 'Moderate Protein',
    info: 'High fiber chickpea protein.', 
    bestTime: 'Lunch', 
    prep: 'Chole Masala / Roasted Chickpeas',
    tips: { fat_loss: 'Avoid Fried Bhature.', bulk: 'Great calorie dense meal.' },
    restricted: [] 
  },

  // 🥛 DAIRY
  'curd': { 
    protein: 11, carbs: 4.5, fat: 4.3, calories: 98, 
    unit: 'cup', unitValue: 200, unitProtein: 22, emoji: '🥣', diet: 'both', 
    category: 'High Protein',
    info: 'Probiotic boost for gut health.', 
    bestTime: 'Lunch, Dinner', 
    prep: 'With Stevia / Raita',
    tips: { fat_loss: 'Use low-fat milk for curd.', bulk: 'Full fat curd is fine.' },
    restricted: [] 
  },
  milk: { 
    protein: 3.4, carbs: 5, fat: 1, calories: 42, 
    unit: '250ml Glass', unitValue: 250, unitProtein: 8.5, emoji: '🥛', diet: 'both', 
    category: 'Moderate Protein',
    info: 'Perfect post-workout or before bed.', 
    bestTime: 'Breakfast, Post-Workout', 
    prep: 'Cold / Warm / with Turmeric',
    tips: { fat_loss: 'Use skimmed or low fat.', bulk: 'Full cream milk for extra calories.' },
    restricted: [] 
  },
  'greek-yogurt': { 
    protein: 10, carbs: 3.6, fat: 0.4, calories: 59, 
    unit: 'cup', unitValue: 150, unitProtein: 15, emoji: '🍦', diet: 'both', 
    category: 'High Protein',
    info: 'Probiotic rich lean protein.', 
    bestTime: 'Breakfast, Snacks', 
    prep: 'Raw with Fruit / Smoothie',
    tips: { fat_loss: 'Great late night snack.', bulk: 'Mix with whey for protein bomb.' },
    restricted: [] 
  },

  // 🌾 CARBS
  'roti': { 
    protein: 3, carbs: 15, fat: 0.5, calories: 70, 
    unit: 'roti', unitValue: 1, unitProtein: 3, emoji: '🫓', diet: 'both', 
    category: 'Carb Sources',
    info: 'Whole wheat complex carbohydrate.', 
    bestTime: 'Lunch, Dinner', 
    prep: 'Phulka (No Ghee) / Roasted',
    tips: { fat_loss: 'Limit to 1-2 per meal.', bulk: 'Eat 3-4 for mass gain.' },
    restricted: [] 
  },
  rice: { 
    protein: 2.7, carbs: 28, fat: 0.3, calories: 130, 
    unit: 'cup', unitValue: 150, unitProtein: 4, emoji: '🍚', diet: 'both', 
    category: 'Carb Sources',
    info: 'Fast-digesting fuel for recovery.', 
    bestTime: 'Lunch, Post-Workout', 
    prep: 'Steamed / Pulao',
    tips: { fat_loss: 'Limit to 1 small cup.', bulk: 'Large portion post-training.' },
    restricted: ['Diabetes'] 
  },
  'brown-rice': { 
    protein: 3, carbs: 23, fat: 0.9, calories: 110, 
    unit: 'cup', unitValue: 150, unitProtein: 4.5, emoji: '🍚', diet: 'both', 
    category: 'Carb Sources',
    info: 'High fiber energy source.', 
    bestTime: 'Lunch', 
    prep: 'Steamed / Brown Pulao',
    tips: { fat_loss: 'Better choice than white rice.', bulk: 'Pair with Dal/Rajma.' },
    restricted: [] 
  },
  oats: { 
    protein: 16.9, carbs: 66, fat: 6.9, calories: 389, 
    unit: 'serving', unitValue: 50, unitProtein: 8.5, emoji: '🥣', diet: 'both', 
    category: 'Moderate Protein',
    info: 'Complex carbs for steady energy.', 
    bestTime: 'Breakfast, Pre-Workout', 
    prep: 'Overnight Oats / Masala Oats',
    tips: { fat_loss: 'Avoid sugar/honey.', bulk: 'Add milk and nuts for extra calories.' },
    restricted: ['Diabetes'] 
  },
  'poha': { 
    protein: 3, carbs: 25, fat: 1.5, calories: 125, 
    unit: 'plate', unitValue: 150, unitProtein: 4.5, emoji: '🍚', diet: 'both', 
    category: 'Carb Sources',
    info: 'Flat rice breakfast option.', 
    bestTime: 'Breakfast', 
    prep: 'Steamed with Veggies',
    tips: { fat_loss: 'Add lots of veggies.', bulk: 'Add peanuts for calories.' },
    restricted: [] 
  },
  'upma': { 
    protein: 4, carbs: 32, fat: 4, calories: 180, 
    unit: 'bowl', unitValue: 150, unitProtein: 6, emoji: '🥣', diet: 'both', 
    category: 'Carb Sources',
    info: 'Semolina based breakfast.', 
    bestTime: 'Breakfast', 
    prep: 'Suji Upma with Peas/Carrots',
    tips: { fat_loss: 'Use minimal oil.', bulk: 'Add cashews for mass.' },
    restricted: [] 
  },

  // 🥜 FATS
  'peanut-butter': { 
    protein: 25, carbs: 20, fat: 50, calories: 588, 
    unit: 'spoon', unitValue: 15, unitProtein: 3.8, emoji: '🥜', diet: 'both', 
    category: 'Healthy Fats',
    info: 'Protein dense healthy fat.', 
    bestTime: 'Pre-Workout, Breakfast', 
    prep: 'With Roti / Oats',
    tips: { fat_loss: 'One spoon max.', bulk: '2 spoons with every meal.' },
    restricted: [] 
  },
  peanuts: { 
    protein: 26, carbs: 16, fat: 49, calories: 567, 
    unit: 'handful', unitValue: 30, unitProtein: 7.8, emoji: '🥜', diet: 'both', 
    category: 'Healthy Fats',
    info: 'Healthy fats and protein boost.', 
    bestTime: 'Pre-Workout', 
    prep: 'Roasted / Raw',
    tips: { fat_loss: 'Strict portion control (one handful).', bulk: 'Energy dense pre-workout fuel.' },
    restricted: [] 
  },
  
  // 🍗 NON-VEGETARIAN
  eggs: { 
    protein: 13, carbs: 1.1, fat: 11, calories: 155, 
    unit: 'egg', unitValue: 1, unitProtein: 6, emoji: '🥚', diet: 'non_vegetarian', 
    category: 'High Protein',
    info: 'Gold standard for bioavailable protein.', 
    bestTime: 'Breakfast, Post-Workout', 
    prep: 'Boiled / Omelette / Scrambled',
    tips: { fat_loss: 'Use 4 whites + 1 whole egg.', bulk: '5-6 whole eggs for growth.' },
    restricted: [] 
  },
  'chicken-breast': { 
    protein: 31, carbs: 0, fat: 3.6, calories: 165, 
    unit: '100g', unitValue: 100, unitProtein: 31, emoji: '🍗', diet: 'non_vegetarian', 
    category: 'High Protein',
    info: 'Lean protein for muscle density.', 
    bestTime: 'Lunch, Post-Workout', 
    prep: 'Grilled / Boiled / Roasted',
    tips: { fat_loss: 'Stick to grilled with spices.', bulk: 'Add extra rice/potato.' },
    restricted: [] 
  },
  fish: { 
    protein: 22, carbs: 0, fat: 1.2, calories: 105, 
    unit: '100g', unitValue: 100, unitProtein: 22, emoji: '🐟', diet: 'non_vegetarian', 
    category: 'High Protein',
    info: 'Omega-3 fatty acids and lean protein.', 
    bestTime: 'Dinner, Lunch', 
    prep: 'Steamed / Pan Seared / Curry',
    tips: { fat_loss: 'Steaming is the best option.', bulk: 'White fish for high protein volume.' },
    restricted: ['Thyroid'] 
  },
  mutton: { 
    protein: 25, carbs: 0, fat: 21, calories: 290, 
    unit: '100g', unitValue: 100, unitProtein: 25, emoji: '🥩', diet: 'non_vegetarian', 
    category: 'Moderate Protein',
    info: 'Iron rich muscle builder.', 
    bestTime: 'Lunch', 
    prep: 'Curry (Low Ghee) / Minced Keema',
    tips: { fat_loss: 'Limit to once a week.', bulk: 'Great for weekly mass gain booster.' },
    restricted: ['High Blood Pressure'] 
  },
  broccoli: { 
    protein: 2.8, carbs: 7, fat: 0.4, calories: 34, 
    unit: 'plate', unitValue: 150, unitProtein: 4.2, emoji: '🥦', diet: 'both', 
    category: 'Moderate Protein',
    info: 'Micronutrients and fiber.', 
    bestTime: 'Lunch, Dinner', 
    prep: 'Steamed / Sautéed',
    tips: { fat_loss: 'Unlimited portions encouraged.', bulk: 'Eat for digestion support.' },
    restricted: [] 
  },
  'protein-shake': { 
    protein: 80, carbs: 5, fat: 2, calories: 360, 
    unit: 'scoop', unitValue: 30, unitProtein: 24, emoji: '🥤', diet: 'both', 
    category: 'High Protein',
    info: 'Fast absorbing whey protein.', 
    bestTime: 'Post-Workout', 
    prep: 'Mix with Water / Milk',
    tips: { fat_loss: 'Mix with water.', bulk: 'Add banana and oats.' },
    restricted: [] 
  },
  'paneer-bhurji': { 
    protein: 18, carbs: 8, fat: 20, calories: 280, 
    unit: 'plate', unitValue: 150, unitProtein: 27, emoji: '🍳', diet: 'vegetarian', 
    category: 'High Protein',
    info: 'Scrambled cottage cheese with spices.', 
    bestTime: 'Lunch, Dinner', 
    prep: 'Sautéed with Onions/Tomato',
    tips: { fat_loss: 'Use low-fat paneer.', bulk: 'Use full-fat paneer.' },
    restricted: [] 
  },
  'egg-whites': { 
    protein: 11, carbs: 0.7, fat: 0.2, calories: 52, 
    unit: 'egg', unitValue: 1, unitProtein: 4, emoji: '🥚', diet: 'non_vegetarian', 
    category: 'High Protein',
    info: 'Pure lean protein source.', 
    bestTime: 'Post-Workout, Breakfast', 
    prep: 'Boiled / Scrambled',
    tips: { fat_loss: 'The perfect cutting protein.', bulk: 'Add whole eggs for fats.' },
    restricted: [] 
  },
  'chickpeas': { 
    protein: 19, carbs: 61, fat: 6, calories: 360, 
    unit: 'bowl', unitValue: 150, unitProtein: 14, emoji: '🥙', diet: 'both', 
    category: 'High Protein',
    info: 'Fiber-rich plant protein.', 
    bestTime: 'Lunch, Side-Snack', 
    prep: 'Boiled / Salad / Roasted',
    tips: { fat_loss: 'Great for high-volume snacking.', bulk: 'Add to main meals for extra protein.' },
    restricted: [] 
  },
  'almonds': { 
    protein: 21, carbs: 22, fat: 49, calories: 576, 
    unit: 'handful', unitValue: 25, unitProtein: 5, emoji: '🥜', diet: 'both', 
    category: 'Healthy Fats',
    info: 'Brain food and healthy fats.', 
    bestTime: 'Pre-Workout, Morning', 
    prep: 'Soaked / Raw',
    tips: { fat_loss: 'Max 10 per day.', bulk: 'Dense calorie snack.' },
    restricted: [] 
  },
  'dates': { 
    protein: 2.5, carbs: 75, fat: 0.4, calories: 280, 
    unit: 'piece', unitValue: 1, unitProtein: 0.2, emoji: '🌴', diet: 'both', 
    category: 'Carb Sources',
    info: 'Natural energy booster.', 
    bestTime: 'Pre-Workout', 
    prep: 'Raw / with Milk',
    tips: { fat_loss: 'Limit to 2 pieces.', bulk: '3-5 pieces for quick energy.' },
    restricted: ['Diabetes'] 
  },
  'quinoa': { 
    protein: 14, carbs: 64, fat: 6, calories: 368, 
    unit: '100g', unitValue: 100, unitProtein: 14, emoji: '🥣', diet: 'both', 
    category: 'High Protein',
    info: 'Complete plant protein carbohydrate.', 
    bestTime: 'Lunch, Dinner', 
    prep: 'Boiled / Quinoa Salad',
    tips: { fat_loss: 'Superior rice substitute.', bulk: 'Energy dense complex carb.' },
    restricted: [] 
  },
};

export const goalDietFoodMap = {
  vegetarian: {
    bulk:        ['oats', 'milk', 'paneer', 'soya-chunks', 'peanut-butter', 'greek-yogurt', 'rajma', 'chole'],
    lean_bulk:   ['oats', 'paneer', 'soya-chunks', 'milk', 'dal', 'greek-yogurt', 'sprouts'],
    cut:         ['soya-chunks', 'dal', 'broccoli', 'greek-yogurt', 'tofu', 'sprouts', 'protein-shake'],
    fat_loss:    ['soya-chunks', 'dal', 'broccoli', 'greek-yogurt', 'tofu', 'sprouts', 'protein-shake'],
    tone_body:   ['tofu', 'dal', 'broccoli', 'greek-yogurt', 'milk', 'sprouts'],
    maintenance: ['dal', 'milk', 'paneer', 'oats', 'roti', 'rice', 'curd', 'quinoa'],
  },
  non_vegetarian: {
    bulk:        ['eggs', 'chicken-breast', 'rice', 'milk', 'oats', 'fish', 'mutton', 'peanut-butter'],
    lean_bulk:   ['chicken-breast', 'eggs', 'fish', 'rice', 'milk', 'greek-yogurt', 'oats'],
    cut:         ['chicken-breast', 'fish', 'eggs', 'broccoli', 'greek-yogurt', 'sprouts', 'protein-shake', 'egg-whites'],
    fat_loss:    ['fish', 'chicken-breast', 'eggs', 'broccoli', 'greek-yogurt', 'sprouts', 'egg-whites', 'protein-shake'],
    tone_body:   ['chicken-breast', 'fish', 'eggs', 'broccoli', 'milk'],
    maintenance: ['eggs', 'chicken-breast', 'fish', 'rice', 'milk', 'roti', 'curd', 'quinoa'],
  },
};

export const mealFoodMap = {
  vegetarian: {
    Breakfast:      ['oats', 'paneer-bhurji', 'poha', 'upma', 'greek-yogurt', 'sprouts'],
    Lunch:          ['dal', 'paneer', 'tofu', 'rajma', 'chole', 'roti', 'rice', 'curd', 'quinoa'],
    'Pre-Workout':  ['peanuts', 'oats', 'banana', 'peanut-butter', 'dates', 'almonds'],
    'Post-Workout': ['soya-chunks', 'protein-shake', 'greek-yogurt', 'milk', 'chickpeas', 'quinoa'],
    Dinner:         ['dal', 'tofu', 'broccoli', 'paneer-bhurji', 'roti', 'curd'],
  },
  non_vegetarian: {
    Breakfast:      ['eggs', 'paneer-bhurji', 'greek-yogurt', 'oats', 'poha', 'sprouts'],
    Lunch:          ['chicken-breast', 'rice', 'fish', 'mutton', 'roti', 'dal', 'curd', 'quinoa'],
    'Pre-Workout':  ['oats', 'peanuts', 'banana', 'peanut-butter', 'dates', 'almonds'],
    'Post-Workout': ['chicken-breast', 'egg-whites', 'protein-shake', 'rice', 'eggs', 'fish'],
    Dinner:         ['fish', 'broccoli', 'chicken-breast', 'curd', 'egg-whites', 'paneer'],
  },
};

export const getMealPlan = (userData) => {
  const { proteinTarget, diet, healthCondition = 'None', goal = { id: 'maintenance' } } = userData;
  const dietKey = diet === 'non_vegetarian' ? 'non_vegetarian' : 'vegetarian';
  const goalId = goal.id || 'maintenance';
  
  // High Protein Distribution: 25% Breakfast, 20% Lunch, 15% Pre-Workout, 25% Post-Workout, 15% Dinner
  const distribution = [0.25, 0.20, 0.15, 0.25, 0.15]; 
  const mealNames = [
    { name: 'Breakfast',     time: '07:00 AM – 09:00 AM', icon: '🌅' },
    { name: 'Lunch',         time: '01:00 PM – 03:00 PM', icon: '☀️' },
    { name: 'Pre-Workout',   time: '30–45 mins before',   icon: '⚡' },
    { name: 'Post-Workout',  time: 'Within 30 mins after', icon: '💪' },
    { name: 'Dinner',        time: '07:00 PM – 09:00 PM', icon: '🌙' },
  ];

  return mealNames.map((m, i) => {
    const mealTargetProtein = Math.round(proteinTarget * distribution[i]);
    
    // Get all suitable foods for this meal
    const possibleFoodKeys = (mealFoodMap[dietKey][m.name] || ['oats']).filter(k => {
        const f = foodDb[k];
        return f && !f.restricted.includes(healthCondition);
    });

    // Generate 4-6 options
    const options = possibleFoodKeys.slice(0, 6).map(foodKey => {
      const food = foodDb[foodKey];
      
      // Calculate Quantity to match mealTargetProtein
      let quantityText = '';
      let servingSize = 0;
      
      if (food.unit === 'egg') {
        servingSize = Math.max(2, Math.round(mealTargetProtein / food.unitProtein));
        quantityText = `${servingSize} Eggs`;
      } else if (food.unit === '100g') {
        servingSize = Math.round((mealTargetProtein / food.protein) * 100);
        quantityText = `${servingSize}g`;
      } else if (food.unit === 'spoon' || food.unit === 'handful') {
        servingSize = Math.round(mealTargetProtein / food.unitProtein);
        quantityText = `${servingSize} ${food.unit}${servingSize > 1 ? 's' : ''}`;
      } else {
        servingSize = Math.max(1, Math.round(mealTargetProtein / food.unitProtein));
        quantityText = `${servingSize} ${food.unit}${servingSize > 1 ? 's' : ''}`;
      }

      const proteinCalculated = food.unit === '100g' 
        ? Math.round((food.protein / 100) * servingSize)
        : Math.round(food.unitProtein * servingSize);

      const coachingTip = food.tips?.[goalId] || food.info;

      return {
        food: foodKey.replace('-', ' '),
        quantity: quantityText,
        protein: proteinCalculated,
        calories: Math.round((food.calories / 100) * (food.unit === '100g' ? servingSize : (servingSize * food.unitValue))),
        prep: food.prep,
        instruction: coachingTip,
        foodDetails: { ...food, name: foodKey, image: `/foods/${foodKey}.png` }
      };
    });

    return {
      ...m,
      targetProtein: mealTargetProtein,
      options: options
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
