import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  assertCloudinaryAssetOwnership,
  CloudinaryAssetError,
  destroyCloudinaryAsset,
  parseCloudinaryAssetFromUrl,
} from '@/lib/cloudinary-server';
import { extractBearerToken, verifyIdToken } from '@/lib/firebase-admin';

const deleteRequestSchema = z.object({
  secureUrl: z.string().url().max(2000),
});

export async function POST(request: Request): Promise<NextResponse> {
  const token = extractBearerToken(request.headers.get('Authorization'));

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = deleteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const asset = parseCloudinaryAssetFromUrl(parsed.data.secureUrl);
    assertCloudinaryAssetOwnership(asset.publicId, uid);
    await destroyCloudinaryAsset(asset.publicId, asset.resourceType);
    return NextResponse.json({ result: 'ok' });
  } catch (error) {
    if (error instanceof CloudinaryAssetError) {
      const status = error.message === 'Unauthorized asset' ? 403 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }

    console.error('[cloudinary-delete] Failed to delete asset:', error);
    return NextResponse.json(
      { error: 'Failed to delete Cloudinary asset' },
      { status: 500 },
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
