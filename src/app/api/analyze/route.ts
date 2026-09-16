import { NextResponse } from 'next/server';
import { analyzeIssueImage } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();
    if (!imageBase64) {
      return NextResponse.json({ error: 'Image base64 is required' }, { status: 400 });
    }

    const analysis = await analyzeIssueImage(imageBase64);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      {
        category: 'Other',
        severity: 3,
        description: 'Failed to analyze image, please edit manually.',
        confidence: 0.0,
        urgency: 'Medium',
      },
      { status: 500 }
    );
  }
}
