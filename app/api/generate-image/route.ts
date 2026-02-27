import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

interface GenerateImageRequest {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
}

interface GenerateImageResponse {
  success: boolean;
  imageData?: string;
  error?: string;
  retryAfter?: number;
}

interface HFError extends Error {
  status?: number;
  estimated_time?: number;
}

const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);

const MODEL_ID = 'stabilityai/stable-diffusion-xl-base-1.0';
const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 1024;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export async function POST(request: Request): Promise<NextResponse<GenerateImageResponse>> {
  try {
    const body: GenerateImageRequest = await request.json();
    
    if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Prompt ist erforderlich (min. 5 Zeichen)' },
        { status: 400 }
      );
    }

    const { 
      prompt, 
      negative_prompt = 'blurry, low quality, distorted, watermark',
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT
    } = body;

    let lastError: HFError | null = null;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await hf.textToImage({
          model: MODEL_ID,
          inputs: prompt,
          parameters: {
            negative_prompt,
            width,
            height,
            num_inference_steps: 30,
          },
        });

        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const imageData = `image/png;base64,${base64}`;

        return NextResponse.json({ success: true, imageData });
        
      } catch (error) {
        lastError = error as HFError;
        
        if (lastError.status === 503 && attempt < MAX_RETRIES) {
          const retryAfter = (lastError.estimated_time || RETRY_DELAY_MS / 1000) * 1000;
          console.log(`[HF] Model loading, retry ${attempt}/${MAX_RETRIES} in ${retryAfter}ms`);
          await new Promise(resolve => setTimeout(resolve, retryAfter));
          continue;
        }
        
        break;
      }
    }

    console.error('[HF] Image generation failed after retries:', lastError);
    
    if (lastError?.status === 503) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Modell wird noch geladen. Bitte in 20-30 Sekunden erneut versuchen.',
          retryAfter: 30
        },
        { status: 503 }
      );
    }
    
    if (lastError?.status === 429) {
      return NextResponse.json(
        { success: false, error: 'Rate limit erreicht. Bitte warten Sie einen Moment.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Bildgenerierung fehlgeschlagen. Bitte erneut versuchen.' },
      { status: 500 }
    );

  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Ungültiges JSON im Request' },
        { status: 400 }
      );
    }
    
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
