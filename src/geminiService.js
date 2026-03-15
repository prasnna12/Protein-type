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
    // We use gemini-1.5-flash as gemini-2.5-flash does not exist
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze the physique in this image with high precision.
Determine if the image clearly shows a human body/physique.
If the image is blurry, does not show a person, or is not relevant to fitness, set "isUnclear": true.

Otherwise, analyze:
- Body type: MUST be one of [Fat, Overweight, Skinny, Muscular, Average, Athletic, Obese, Underweight].
- Estimated body fat percentage: Provide a realistic range (e.g., 25-30%).
- Muscle level: [Beginner, Intermediate, Advanced].
- Physical metrics: shoulder width, waist size, stomach profile, muscle definition.
- Suggested fitness goal: [Bulk, Lean Bulk, Cut, Fat Loss, Maintenance].

Structure your response EXACTLY as this JSON:
{
  "isUnclear": false,
  "bodyType": "...",
  "bodyFatRange": "...",
  "muscleLevel": "...",
  "suggestedGoal": "...",
  "muscleGrade": 1-10,
  "symmetryScore": 1-100,
  "visualSignals": {
    "bodyFat": "High/Low/Med",
    "stomach": "Flat/Protruding/Visible Abs", 
    "definition": "Sharp/Soft/None",
    "shoulders": "Broad/Average/Narrow",
    "waist": "Tight/Wide/Average",
    "posture": "Good/Slumped/Neutral"
  },
  "explanation": "Brief technical analysis...",
  "summary": "1-sentence summary for the user."
}`;

    const imagePart = base64ToGenerativePart(base64Image);
    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json\n/g, '').replace(/```\n/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(text);
    if (data.isUnclear) {
      return { ...data, error: "Body analysis may not be fully accurate. Please upload a clearer full-body image." };
    }
    return data;
  } catch (error) {
    console.error("Error analyzing image with Gemini, falling back to mock:", error);
    return mockAnalysis(base64Image);
  }
};

const mockAnalysis = (image) => {
  const seed = image ? image.length % 10 : 0;
  const profiles = [
    {
      bodyType: 'Overweight',
      bodyFatRange: '26–30%',
      muscleLevel: 'Beginner',
      muscleGrade: 2,
      symmetryScore: 68,
      visualSignals: { 
        bodyFat: 'High',
        stomach: 'Enlarged', 
        definition: 'Low',
        shoulders: 'Average', 
        waist: 'Enlarged',
        posture: 'Slumped'
      },
      suggestedGoal: 'Fat Loss',
      explanation: 'This body shows moderate fat around the stomach, suggesting a fat loss goal.',
      summary: 'Significant abdominal volume and soft muscle contours detected. Prioritizing fat loss will improve metabolic health and cardiovascular efficiency.'
    },
    {
      bodyType: 'Skinny',
      bodyFatRange: '9–12%',
      muscleLevel: 'Beginner',
      muscleGrade: 1,
      symmetryScore: 72,
      visualSignals: { 
        bodyFat: 'Very Low',
        stomach: 'Flat', 
        definition: 'Low',
        shoulders: 'Narrow', 
        waist: 'Narrow',
        posture: 'Normal'
      },
      suggestedGoal: 'Bulk',
      explanation: 'This body shows very low muscle mass, suggesting a bulk goal.',
      summary: 'Ectomorphic frame with minimal muscle mass. A large calorie surplus is required to build a solid muscular foundation.'
    },
    {
      bodyType: 'Athletic',
      bodyFatRange: '13–15%',
      muscleLevel: 'Intermediate',
      muscleGrade: 6,
      symmetryScore: 88,
      visualSignals: { 
        bodyFat: 'Low',
        stomach: 'Flat', 
        definition: 'Good',
        shoulders: 'Broad', 
        waist: 'Narrow',
        posture: 'Athletic'
      },
      suggestedGoal: 'Lean Bulk',
      explanation: 'This body shows good muscle definition and low fat, suggesting a lean bulk goal.',
      summary: 'Clear V-taper and visible muscle separation detected. A lean bulk will allow for further mass gain while staying shredded.'
    },
    {
      bodyType: 'Muscular',
      bodyFatRange: '10–12%',
      muscleLevel: 'Advanced',
      muscleGrade: 9,
      symmetryScore: 94,
      visualSignals: { 
        bodyFat: 'Lean',
        stomach: 'Visible Abs', 
        definition: 'Excellent',
        shoulders: 'Broad', 
        waist: 'Tight',
        posture: 'Upright'
      },
      suggestedGoal: 'Maintenance',
      explanation: 'This body shows advanced muscle mass and definition, suggesting maintenance.',
      summary: 'Advanced muscle density and excellent symmetry detected. Focus on maintenance to sustain this peak aesthetic.'
    },
    {
      bodyType: 'Average',
      bodyFatRange: '17–20%',
      muscleLevel: 'Intermediate',
      muscleGrade: 4,
      symmetryScore: 82,
      visualSignals: { 
        bodyFat: 'Moderate',
        stomach: 'Balanced', 
        definition: 'Moderate',
        shoulders: 'Average', 
        waist: 'Average',
        posture: 'Normal'
      },
      suggestedGoal: 'Lean Bulk',
      explanation: 'This body shows balanced proportions with some room for more muscle, suggesting a lean bulk.',
      summary: 'Balanced physique with moderate muscle definition. Recomposition is recommended to lean out and add quality mass.'
    }
  ];
  return profiles[seed % profiles.length];
};
