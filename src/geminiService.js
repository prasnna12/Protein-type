import { GoogleGenerativeAI } from '@google/generative-ai';

// Use environment variable for the API Key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper function to convert base64 to File object/GenerativePart
function base64ToGenerativePart(base64String) {
  // Extract MIME type and base64 data reliably
  const matches = base64String.match(/^data:([^;]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid input string');
  }

  return {
    inlineData: {
      data: matches[2],
      mimeType: matches[1]
    },
  };
}

export const analyzeBodyImage = async (base64Image) => {
  try {
    // We use gemini-2.5-flash since 1.5-flash is not available for this API key
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Analyze the physique in this image and estimate the following:
- Body type (Skinny, Average, Athletic, Muscular, Overweight)
- Estimated body fat percentage
- Muscle level
- Suggested fitness goal (Bulk, Lean Bulk, Cut, Fat Loss, Maintenance).

Structure your response EXACTLY as this JSON format, no markdown tags like \`\`\`json:
{
  "bodyType": "...",
  "bodyFatRange": "...",
  "muscleLevel": "...",
  "suggestedGoal": "...",
  "muscleGrade": 5,
  "symmetryScore": 80,
  "visualSignals": {
    "stomach": "...",
    "shoulders": "...",
    "waist": "..."
  },
  "summary": "..."
}`;

    const imagePart = base64ToGenerativePart(base64Image);

    // Call the model with image and prompt together as requested
    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    let text = response.text();
    
    // Clean up response if it contains markdown markers
    text = text.replace(/```json\n/g, '').replace(/```\n/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw error; // Or return mock data as fallback if preferred
  }
};
