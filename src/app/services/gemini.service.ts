import { Injectable } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { AIAnalysisResult, Category } from '../types';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: this.getApiKey() });
  }

  private getApiKey(): string {
    // Try to get from environment or localStorage
    return (window as any).GEMINI_API_KEY || '';
  }

  async analyzeImageForExpiry(base64Image: string): Promise<AIAnalysisResult> {
    const model = 'gemini-3-flash-preview';

    const response = await this.ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image
            }
          },
          {
            text: `You are an AI Butler. Analyze this image (receipt, product label, or document) and extract the product/item name, its expiry or renewal date, and classify it into one of these categories: ${Object.values(Category).join(', ')}. 
            If no specific expiry date is found, estimate based on product type or use the current year end.
            Return the result in JSON format.`
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Name of the item' },
            expiryDate: { type: Type.STRING, description: 'Expiry date in YYYY-MM-DD format' },
            category: { type: Type.STRING, description: 'The most fitting category from the provided list' },
            confidence: { type: Type.NUMBER, description: 'Confidence score 0-1' }
          },
          required: ['name', 'expiryDate', 'category']
        }
      }
    } as any);

    try {
      const result = JSON.parse(response.text || '{}');
      return result as AIAnalysisResult;
    } catch (error) {
      console.error('Failed to parse AI response', error);
      throw new Error('Could not analyze image');
    }
  }
}
