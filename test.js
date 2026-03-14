import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyCcPzmTEdEv7ua4aYumzdRCr7vmmRXW-TE";
const genAI = new GoogleGenerativeAI(API_KEY);

function base64ToGenerativePart(base64String) {
  const matches = base64String.match(/^data:([^;]+);base64,(.+)$/);
  return {
    inlineData: {
      data: matches[2],
      mimeType: matches[1]
    },
  };
}

const img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const prompt = `Return JSON with bodyType: "Test"`;
const imagePart = base64ToGenerativePart(img);

model.generateContent([imagePart, prompt])
  .then(res => console.log(res.response.text()))
  .catch(console.error);

