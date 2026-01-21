
import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeFoodImage(base64Image: string): Promise<FoodItem | null> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `你是一个极度严谨的食物热量分析助手。
  
  核心指令：
  1. 必须优先判断图片主体是否为【可食用食物】。
  2. 如果图片中包含：人脸、人体部位、动物、家具、杂物、或仅为纯背景，必须立即返回 {"is_food": false}。
  3. 绝对禁止为非食物对象（如人头）提供营养数据或猜测名称。
  4. 只有在确认是食物的情况下，才返回食物名称、每100g热量、蛋白质、碳水、脂肪和预估重量。
  5. 识别结果必须符合实际常识。
  
  请严格按照 JSON 格式返回。`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: base64Image } },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_food: { type: Type.BOOLEAN, description: "是否包含有效食物" },
            name: { type: Type.STRING, description: "食物名称" },
            caloriesPer100g: { type: Type.NUMBER, description: "每100克热量" },
            protein: { type: Type.NUMBER, description: "蛋白质" },
            carbs: { type: Type.NUMBER, description: "碳水" },
            fat: { type: Type.NUMBER, description: "脂肪" },
            estimatedWeight: { type: Type.NUMBER, description: "预估克数" },
            confidence: { type: Type.NUMBER, description: "置信度" }
          },
          required: ["is_food"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    const parsed = JSON.parse(text);
    // 如果不是食物，或者没有给出食物名称，视为识别失败
    if (!parsed.is_food || !parsed.name || (parsed.confidence && parsed.confidence < 0.4)) {
      return null;
    }

    return {
      ...parsed,
      id: Math.random().toString(36).substr(2, 9)
    };
  } catch (err) {
    console.error("Analysis Error:", err);
    return null;
  }
}
