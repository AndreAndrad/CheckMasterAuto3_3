
import { GoogleGenAI, Type } from "@google/genai";
import { VehicleInfo } from "../types";

export const performVehicleOCR = async (base64Image: string): Promise<VehicleInfo> => {
  // Always use process.env.API_KEY directly for initialization as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Act as a professional vehicle expert. 
Extract the following information from the provided image:
1. License Plate (format AAA0A00 or AAA-0000)
2. Brand/Manufacturer
3. Vehicle Model
4. Any IMEI or Serial numbers visible

You MUST return only a valid JSON object with the following keys:
- placa: string
- marca: string
- modelo: string
- imei: string[] (array of strings)

Do not include any other text or markdown tags.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            placa: { type: Type.STRING },
            marca: { type: Type.STRING },
            modelo: { type: Type.STRING },
            imei: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["placa", "marca", "modelo", "imei"]
        }
      }
    });

    // Access .text property directly, it is not a method
    const resultText = response.text || "{}";
    return JSON.parse(resultText) as VehicleInfo;
  } catch (error) {
    console.error("AI OCR Error:", error);
    // Return fallback empty structure
    return {
      placa: "",
      marca: "",
      modelo: "",
      imei: []
    };
  }
};
