import { calculateFallbackAnalysis } from './src/geminiService.js';

console.log("Testing Fallback Analysis...");

const maleFallback = calculateFallbackAnalysis(95, 30, 'Male');
console.log("Male Overweight Fallback:", JSON.stringify(maleFallback, null, 2));

const femaleFallback = calculateFallbackAnalysis(55, 22, 'Female');
console.log("Female Lean Fallback:", JSON.stringify(femaleFallback, null, 2));

// Verify expected goals
if (maleFallback.suggestedGoal === 'Fat Loss') {
  console.log("✅ Male Overweight goal check passed.");
} else {
  console.log("❌ Male Overweight goal check failed.");
}

if (femaleFallback.suggestedGoal === 'Tone Body') {
  console.log("✅ Female Lean goal check passed.");
} else {
  console.log("❌ Female Lean goal check failed.");
}
