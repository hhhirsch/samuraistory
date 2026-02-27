import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the public directory path
const publicDir = path.join(process.cwd(), 'public');
const generatedDir = path.join(publicDir, 'generated');

// Ensure the generated directory exists
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const { chapterId, prompt } = await request.json();

    // Validate input
    if (!chapterId || !prompt) {
      return NextResponse.json(
        { error: 'chapterId and prompt are required' },
        { status: 400 }
      );
    }

    // Define the image path
    const imageName = `chapter-${chapterId}.jpg`;
    const imagePath = path.join(generatedDir, imageName);
    const imageUrlPath = `/generated/${imageName}`;

    // Check if image already exists (caching)
    if (fs.existsSync(imagePath)) {
      console.log(`Image already exists for chapter ${chapterId}`);
      return NextResponse.json({ imagePath: imageUrlPath });
    }

    // Generate image using OpenAI DALL-E 3
    console.log(`Generating image for chapter ${chapterId} with prompt: ${prompt}`);
    
    const finalPrompt = `Japanese ukiyo-e woodblock print style, ${prompt}, dramatic lighting, rich colors, no text, no watermark`;
    
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: finalPrompt,
      n: 1,
      size: '1792x1024',
      quality: 'standard',
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    // Download the image from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.buffer();

    // Write the image to the public directory
    await fsPromises.writeFile(imagePath, imageBuffer);

    console.log(`Image saved to ${imagePath}`);

    return NextResponse.json({ imagePath: imageUrlPath });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: (error as Error).message },
      { status: 500 }
    );
  }
}