import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// Note: The API key is expected to be available in the environment variables.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getFinancialInsight = async (
  context: string,
  inputs: Record<string, number>,
  result: string
): Promise<string> => {
  if (!apiKey) {
    return "AI insights are unavailable (API Key missing).";
  }

  try {
    const prompt = `
      You are a helpful financial assistant.
      Context: User is using a calculator for "${context}".
      
      Input Data:
      ${Object.entries(inputs).map(([key, val]) => `- ${key}: ${val}`).join('\n')}
      
      Calculated Result: ${result}
      
      Please provide a very brief, one-sentence insight or tip regarding these figures. 
      For salary, mention if the hike is standard or good. 
      For discounts, mention if it's a significant saving.
      Keep it professional, encouraging, and under 30 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate insight.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to fetch AI insights at this moment.";
  }
};
