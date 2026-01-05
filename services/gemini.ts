
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client using the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class GeminiService {
  /**
   * Performs a non-streaming analysis of blockchain data.
   * Uses 'gemini-3-pro-preview' for complex technical reasoning tasks.
   */
  static async analyzeBlockchainData(dataType: 'block' | 'transaction', data: any) {
    const prompt = `
      You are a specialized Bitcoin blockchain analyst. 
      I am providing you with a JSON object representing a ${dataType}.
      Please provide a human-readable summary that explains:
      1. What this data represents in plain English.
      2. Any interesting technical details (e.g., high fees, large transaction volume, block density).
      3. For transactions: Explain the inputs and outputs clearly.
      4. For blocks: Explain the difficulty and coinbase details.
      
      Keep the tone professional and informative.
      
      DATA:
      ${JSON.stringify(data, null, 2)}
    `;

    try {
      // Use generateContent for a full text response.
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });
      // The text property contains the model's generated response.
      return response.text;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "Unable to perform AI analysis at this time.";
    }
  }

  /**
   * Performs a streaming analysis of blockchain data to provide real-time updates to the UI.
   * Returns an AsyncGenerator that yields text chunks.
   */
  static async *analyzeBlockchainDataStream(dataType: 'block' | 'transaction', data: any) {
    const prompt = `
      You are a specialized Bitcoin blockchain analyst. 
      I am providing you with a JSON object representing a ${dataType}.
      Please provide a human-readable summary that explains:
      1. What this data represents in plain English.
      2. Any interesting technical details (e.g., high fees, large transaction volume, block density).
      3. For transactions: Explain the inputs and outputs clearly.
      4. For blocks: Explain the difficulty and coinbase details.
      
      Keep the tone professional and informative.
      
      DATA:
      ${JSON.stringify(data, null, 2)}
    `;

    try {
      // Use generateContentStream for streaming the response.
      const response = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });
      
      for await (const chunk of response) {
        // Yield each chunk's text to the consumer.
        const text = chunk.text;
        if (text) {
          yield text;
        }
      }
    } catch (error) {
      console.error("Gemini Analysis Streaming Error:", error);
      yield "Unable to perform AI analysis at this time.";
    }
  }
}
