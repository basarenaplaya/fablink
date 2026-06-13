import { NextResponse } from 'next/server';
import { z } from 'zod';

import { signUploadParams } from '@/lib/cloudinary-server';
import { extractBearerToken, verifyIdToken } from '@/lib/firebase-admin';
import type { CloudinarySignResponse } from '@/types';

const signRequestSchema = z.object({
  folder: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-zA-Z0-9/_-]+$/),
  resourceType: z.enum(['image', 'raw', 'auto']).default('image'),
});

export async function POST(request: Request): Promise<NextResponse> {
  const token = extractBearerToken(request.headers.get('Authorization'));

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await verifyIdToken(token);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = signRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = signUploadParams(parsed.data);
    const response: CloudinarySignResponse = result;
    return NextResponse.json(response);
  } catch (error) {
    console.error('[cloudinary-sign] Failed to generate signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 },
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
