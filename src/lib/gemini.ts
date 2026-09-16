import { AIAnalysis } from '@/types';

export async function analyzeIssueImage(imageBase64: string): Promise<AIAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }

  // Remove the data url prefix if it exists
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `You are a civic issue classifier for Indian cities. Analyze this image and respond ONLY in this exact JSON with no markdown or extra text: {"category": "one of [Pothole, Streetlight, Water Leakage, Waste/Garbage, Flooding, Other]", "severity": <integer 1-5 where 5 is most critical>, "description": "one clear sentence describing the civic issue in the image", "confidence": <float 0.0-1.0>, "urgency": "one of [Low, Medium, High, Critical]"}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Data,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse the JSON from Gemini. Sometimes it includes markdown code blocks.
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const analysis = JSON.parse(cleanText) as AIAnalysis;
    
    // Basic validation
    if (!analysis.category || !analysis.severity || !analysis.description) {
      throw new Error('Invalid response structure from Gemini');
    }

    return analysis;
  } catch (error) {
    console.error('Error in analyzeIssueImage:', error);
    // Fallback default response in case of any failure so the app doesn't break
    return {
      category: 'Other',
      severity: 3,
      description: 'A civic issue has been detected and reported.',
      confidence: 0.5,
      urgency: 'Medium',
    };
  }
}
