import axios from 'axios';

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

/* ──────────────────────────────────────────────────────────
   FOOD DATABASE  (per-item nutrition for 100g / serving)
────────────────────────────────────────────────────────── */
export const foodDb = {
  // ── VEGETARIAN ─────────────────────────────────────────
  paneer:          { protein: 18,   carbs: 1.2, fat: 20,  calories: 265, quantity: '100g–150g',              emoji: '🧀', diet: 'vegetarian',     info: '100g of fresh cottage cheese (paneer).', bestTime: 'Lunch, Dinner' },
  tofu:            { protein: 8,    carbs: 1.9, fat: 4.2, calories: 76,  quantity: '150g–200g',              emoji: '🟡', diet: 'vegetarian',     info: '100g of firm tofu.', bestTime: 'Lunch, Dinner, Post workout' },
  'soya chunks':   { protein: 52,   carbs: 33,  fat: 0.5, calories: 345, quantity: '50g dry',                emoji: '🫙', diet: 'vegetarian',     info: '100g of dry soya chunks.', bestTime: 'Lunch, Post workout' },
  dal:             { protein: 9,    carbs: 20,  fat: 0.4, calories: 116, quantity: '200g (1 bowl)',          emoji: '🍲', diet: 'vegetarian',     info: '100g of cooked lentils (dal).', bestTime: 'Lunch, Dinner' },
  chickpeas:       { protein: 19,   carbs: 61,  fat: 6,   calories: 364, quantity: '100g–150g cooked',       emoji: '🫘', diet: 'vegetarian',     info: '100g of cooked chickpeas (chana).', bestTime: 'Lunch' },
  'kidney beans':  { protein: 24,   carbs: 60,  fat: 1.5, calories: 337, quantity: '100g–150g cooked',       emoji: '🫘', diet: 'vegetarian',     info: '100g of cooked kidney beans (rajma).', bestTime: 'Lunch' },
  'greek yogurt':  { protein: 10,   carbs: 3.6, fat: 0.4, calories: 59,  quantity: '150g (1 cup)',           emoji: '🥛', diet: 'both',           info: '100g of low-fat Greek yogurt.', bestTime: 'Breakfast, Snacks' },
  milk:            { protein: 3.4,  carbs: 4.8, fat: 3.3, calories: 61,  quantity: '250ml (1 glass)',        emoji: '🥛', diet: 'both',           info: '100g of whole milk.', bestTime: 'Breakfast, Post workout' },
  'peanut butter': { protein: 25,   carbs: 20,  fat: 50,  calories: 588, quantity: '30g (2 tbsp)',           emoji: '🥜', diet: 'both',           info: '100g of smooth peanut butter.', bestTime: 'Breakfast, Pre-workout' },
  oats:            { protein: 16.9, carbs: 66,  fat: 6.9, calories: 389, quantity: '80g dry',                emoji: '🌾', diet: 'both',           info: '100g of dry rolled oats.', bestTime: 'Breakfast' },
  almonds:         { protein: 21,   carbs: 22,  fat: 49,  calories: 579, quantity: '28g (10-12 nuts)',       emoji: '🌰', diet: 'vegetarian',     info: '100g of raw almonds.', bestTime: 'Breakfast, Snacks' },
  quinoa:          { protein: 14,   carbs: 64,  fat: 6,   calories: 368, quantity: '150g cooked',            emoji: '🌾', diet: 'vegetarian',     info: '100g of cooked quinoa.', bestTime: 'Lunch' },
  'banana smoothie': { protein: 12,  carbs: 45, fat: 5,   calories: 280, quantity: '1 large glass',          emoji: '🥤', diet: 'both',           info: 'Whey, banana, and milk blend.', bestTime: 'Breakfast' },
  'banana shake':   { protein: 15,  carbs: 48, fat: 6,   calories: 310, quantity: '1 large glass',          emoji: '🥤', diet: 'both',           info: 'Post-workout recovery shake.', bestTime: 'Post-workout' },
  'whey protein':   { protein: 24,  carbs: 3,  fat: 1.5, calories: 120, quantity: '1 scoop (33g)',           emoji: '🥤', diet: 'both',           info: 'High-quality whey protein isolate.', bestTime: 'Post-workout' },
  dates:            { protein: 2,   carbs: 75, fat: 0.4, calories: 282, quantity: '3-4 pieces',              emoji: '🌴', diet: 'both',           info: 'Natural quick energy source.', bestTime: 'Pre-workout' },
  'black coffee':   { protein: 0.1, carbs: 0,  fat: 0,   calories: 2,   quantity: '1 cup',                   emoji: '☕', diet: 'both',           info: 'Great pre-workout stimulant.', bestTime: 'Pre-workout' },
  salad:            { protein: 2,   carbs: 10, fat: 0.1, calories: 45,  quantity: '1 large bowl',             emoji: '🥗', diet: 'both',           info: 'Mixed greens and vegetables.', bestTime: 'Lunch, Dinner' },
  // ── NON-VEGETARIAN ─────────────────────────────────────
  egg:             { protein: 13,   carbs: 1.1, fat: 11,  calories: 155, quantity: '2-3 whole eggs',         emoji: '🥚', diet: 'non_vegetarian', info: '100g of whole boiled eggs.', bestTime: 'Breakfast' },
  'egg whites':    { protein: 11,   carbs: 0.7, fat: 0.2, calories: 52,  quantity: '4-5 egg whites',         emoji: '⚪', diet: 'non_vegetarian', info: 'Pure protein source.', bestTime: 'Breakfast, Post-workout' },
  'chicken breast':{ protein: 31,   carbs: 0,   fat: 3.6, calories: 165, quantity: '200g portion',           emoji: '🍗', diet: 'non_vegetarian', info: '100g of roasted chicken breast.', bestTime: 'Lunch, Dinner, Post workout' },
  'grilled chicken':{ protein: 31,  carbs: 0,   fat: 4,   calories: 170, quantity: '200g portion',           emoji: '🍗', diet: 'non_vegetarian', info: 'Perfect for dinner.', bestTime: 'Dinner' },
  fish:            { protein: 22,   carbs: 0,   fat: 1.2, calories: 105, quantity: '150g (1 fillet)',        emoji: '🐟', diet: 'non_vegetarian', info: '100g of white fish fillet.', bestTime: 'Lunch, Dinner' },
  'lean meat':     { protein: 26,   carbs: 0,   fat: 4,   calories: 143, quantity: '150g portion',           emoji: '🥩', diet: 'non_vegetarian', info: '100g of lean red meat.', bestTime: 'Lunch, Dinner' },
  turkey:          { protein: 29,   carbs: 0,   fat: 1.5, calories: 135, quantity: '150g portion',           emoji: '🦃', diet: 'non_vegetarian', info: '100g of turkey breast.', bestTime: 'Lunch, Dinner' },
  tuna:            { protein: 30,   carbs: 0,   fat: 0.5, calories: 130, quantity: '1 can drained',          emoji: '🐟', diet: 'non_vegetarian', info: '100g of canned tuna in water.', bestTime: 'Lunch' },
  // ── SHARED CARBS / SIDES ───────────────────────────────
  rice:            { protein: 2.7,  carbs: 28,  fat: 0.3, calories: 130, quantity: '150g (1 cup cooked)',    emoji: '🍚', diet: 'both',           info: '100g of white rice (cooked).', bestTime: 'Lunch' },
  'brown rice':    { protein: 2.6,  carbs: 23,  fat: 0.9, calories: 112, quantity: '150g (1 cup cooked)',    emoji: '🍚', diet: 'both',           info: '100g of cooked brown rice.', bestTime: 'Lunch' },
  'sweet potato':  { protein: 1.6,  carbs: 20,  fat: 0.1, calories: 86,  quantity: '150g (1 medium)',        emoji: '🍠', diet: 'both',           info: '100g of baked sweet potato.', bestTime: 'Lunch' },
  banana:          { protein: 1.1,  carbs: 23,  fat: 0.3, calories: 89,  quantity: '1 medium banana',        emoji: '🍌', diet: 'both',           info: '100g of fresh banana.', bestTime: 'Pre-workout, Breakfast' },
  broccoli:        { protein: 2.8,  carbs: 7,   fat: 0.4, calories: 34,  quantity: '200g (2 cups)',          emoji: '🥦', diet: 'both',           info: '100g of raw broccoli.', bestTime: 'Lunch, Dinner' },
  vegetables:      { protein: 2,    carbs: 10,  fat: 0.2, calories: 50,  quantity: '150g portion',           emoji: '🥦', diet: 'both',           info: 'Mixed seasonal vegetables.', bestTime: 'Lunch, Dinner' },
};

/* ──────────────────────────────────────────────────────────
   GOAL × DIET FOOD MAP
   Each entry: list of food keys from foodDb
────────────────────────────────────────────────────────── */
export const goalDietFoodMap = {
  // VEGETARIAN
  vegetarian: {
    bulk:        ['oats', 'milk', 'paneer', 'soya chunks', 'rice', 'peanut butter', 'banana', 'greek yogurt'],
    lean_bulk:   ['quinoa', 'paneer', 'tofu', 'greek yogurt', 'chickpeas', 'oats', 'almonds'],
    cut:         ['tofu', 'dal', 'broccoli', 'soya chunks', 'oats', 'greek yogurt'],
    fat_loss:    ['tofu', 'dal', 'broccoli', 'soya chunks', 'oats', 'greek yogurt'],
    maintenance: ['dal', 'kidney beans', 'rice', 'paneer', 'greek yogurt', 'almonds', 'banana'],
  },
  // NON-VEGETARIAN
  non_vegetarian: {
    bulk:        ['chicken breast', 'egg', 'rice', 'oats', 'milk', 'peanut butter', 'banana', 'sweet potato'],
    lean_bulk:   ['chicken breast', 'tuna', 'egg', 'brown rice', 'greek yogurt', 'oats'],
    cut:         ['chicken breast', 'fish', 'egg', 'turkey', 'broccoli', 'oats'],
    fat_loss:    ['tuna', 'fish', 'turkey', 'egg', 'broccoli', 'greek yogurt'],
    maintenance: ['chicken breast', 'egg', 'rice', 'fish', 'sweet potato', 'greek yogurt', 'banana'],
  },
};

/* ──────────────────────────────────────────────────────────
   MEAL × DIET FOOD MAP
   Specific foods recommended per meal, filtered by diet
────────────────────────────────────────────────────────── */
export const mealFoodMap = {
  vegetarian: {
    Breakfast:      ['oats', 'milk', 'paneer', 'greek yogurt', 'peanut butter', 'banana smoothie'],
    Lunch:          ['rice', 'dal', 'kidney beans', 'paneer', 'chickpeas', 'soya chunks', 'vegetables'],
    'Pre-Workout':  ['banana', 'oats', 'peanut butter', 'dates', 'greek yogurt', 'black coffee'],
    'Post-Workout': ['paneer', 'greek yogurt', 'soya chunks', 'milk', 'tofu', 'banana shake'],
    Dinner:         ['dal', 'paneer', 'tofu', 'vegetables', 'quinoa', 'salad'],
  },
  non_vegetarian: {
    Breakfast:      ['oats', 'egg', 'milk', 'greek yogurt', 'peanut butter', 'banana smoothie'],
    Lunch:          ['rice', 'chicken breast', 'fish', 'dal', 'vegetables', 'sweet potato', 'kidney beans'],
    'Pre-Workout':  ['banana', 'oats', 'peanut butter', 'dates', 'greek yogurt', 'black coffee'],
    'Post-Workout': ['chicken breast', 'egg whites', 'whey protein', 'greek yogurt', 'milk', 'banana shake'],
    Dinner:         ['grilled chicken', 'fish', 'turkey', 'dal', 'vegetables', 'salad'],
  },
};

export const getMealFoods = (mealName, diet) => {
  const dietKey = diet === 'non_vegetarian' ? 'non_vegetarian' : 'vegetarian';
  const keys = mealFoodMap[dietKey]?.[mealName] || mealFoodMap.vegetarian.Breakfast;
  return keys.map(key => {
    const entry = foodDb[key];
    if (!entry) return null;
    return { name: key, image: `/foods/${key.replace(/\s+/g, '-')}.png`, ...entry };
  }).filter(Boolean);
};


export const getMealPlan = (userData) => {
  const { proteinTarget, diet, goal, age, healthCondition, weight, gender } = userData;
  const goalId = goal?.id || 'maintenance';
  const foodKeys = goalDietFoodMap[diet]?.[goalId] || goalDietFoodMap['vegetarian']['maintenance'];
  
  // 6-meal distribution (including Snack)
  const distribution = [0.22, 0.20, 0.10, 0.12, 0.22, 0.14];
  
  const mealNames = [
    { name: 'Breakfast',     time: '08:00 AM', purpose: 'Kickstart morning metabolism', icon: '🌅' },
    { name: 'Snack',         time: '11:00 AM', purpose: 'Maintain energy levels', icon: '🍎' },
    { name: 'Lunch',         time: '01:30 PM', purpose: 'Main sustained energy', icon: '☀️' },
    { name: 'Pre-Workout',   time: '04:30 PM', purpose: 'Fuel for performance', icon: '⚡' },
    { name: 'Post-Workout',  time: '06:30 PM', purpose: 'Muscle repair/recovery', icon: '💪' },
    { name: 'Dinner',        time: '09:00 PM', purpose: 'Overnight recovery', icon: '🌙' },
  ];

  return mealNames.map((m, i) => {
    let foodKey = foodKeys[i % foodKeys.length];
    
    // Disease based adjustments
    if (healthCondition === 'Diabetes') {
      if (foodKey === 'rice') foodKey = 'brown rice';
      if (foodKey === 'banana' || foodKey === 'dates') foodKey = 'oats';
      if (m.name === 'Snack') foodKey = 'almonds';
    } else if (healthCondition === 'High Blood Pressure') {
      if (m.name === 'Snack') foodKey = 'banana'; // Potassium rich
      if (foodKey === 'paneer') foodKey = 'fish' || 'tofu';
    }

    const food = foodDb[foodKey] || foodDb['oats'];
    const portionMultiplier = (proteinTarget * distribution[i]) / food.protein;
    
    // Add beginner friendly explanation
    let explanation = `This provides high-quality ${food.diet === 'vegetarian' ? 'plant' : 'animal'} protein. `;
    if (foodKey === 'egg whites') explanation += "Low fat, high protein choice.";
    if (foodKey === 'oats') explanation += "Complex carbs for sustained energy.";
    if (foodKey === 'paneer') explanation += "Casein protein for slow digestion.";

    return {
      ...m,
      protein: Math.round(proteinTarget * distribution[i]),
      carbs: Math.round(food.carbs * portionMultiplier),
      fat: Math.round(food.fat * portionMultiplier),
      calories: Math.round(food.calories * portionMultiplier),
      food: foodKey,
      explanation,
      foodEmoji: food.emoji || '🍽️',
      foodDetails: { ...food, name: foodKey }
    };
  });
};

/* ──────────────────────────────────────────────────────────
   GET FOOD ITEMS FOR RECOMMENDATIONS SLIDE
────────────────────────────────────────────────────────── */
export const getRecommendedFoods = (diet, goalId) => {
  const keys = goalDietFoodMap[diet]?.[goalId]
    || goalDietFoodMap['vegetarian']['maintenance'];

  return keys.map(key => {
    const entry = foodDb[key];
    if (!entry) return null;
    const fileName = key.replace(/\s+/g, '-');
    return {
      name: key,
      image: `/foods/${fileName}.png`,
      ...entry,
    };
  }).filter(Boolean);
};

/* ──────────────────────────────────────────────────────────
   LEGACY API-BACKED FUNCTION (kept for compatibility)
────────────────────────────────────────────────────────── */
export const fetchFoodNutrition = async (foodName) => {
  const lowerName = foodName.toLowerCase();
  // Always use local DB — reliable and instant
  const entry = foodDb[lowerName];
  if (entry) {
    const fileName = lowerName.replace(/\s+/g, '-');
    return { name: foodName, image: `/foods/${fileName}.png`, ...entry };
  }
  // Fallback generic
  return {
    name: foodName,
    image: `/foods/${lowerName.replace(/\s+/g, '-')}.png`,
    protein: 10, carbs: 10, fat: 5, calories: 125,
    quantity: '100g per serving', emoji: '🍽️',
    info: `Nutrition for 100g of ${foodName}.`,
  };
};
