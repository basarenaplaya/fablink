import 'server-only';

import { v2 as cloudinary } from 'cloudinary';

import type { CloudinaryResourceType } from '@/types';

interface CloudinaryPublicConfig {
  cloudName: string;
  apiKey: string;
}

interface SignUploadParamsInput {
  folder: string;
  resourceType: CloudinaryResourceType;
}

interface SignUploadParamsResult {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: CloudinaryResourceType;
}

function getRequiredServerEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function initCloudinary(): void {
  cloudinary.config({
    cloud_name: getRequiredServerEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'),
    api_key: getRequiredServerEnv('NEXT_PUBLIC_CLOUDINARY_API_KEY'),
    api_secret: getRequiredServerEnv('CLOUDINARY_API_SECRET'),
    secure: true,
  });
}

initCloudinary();

export function getCloudinaryConfig(): CloudinaryPublicConfig {
  return {
    cloudName: getRequiredServerEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'),
    apiKey: getRequiredServerEnv('NEXT_PUBLIC_CLOUDINARY_API_KEY'),
  };
}

export class CloudinaryAssetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CloudinaryAssetError';
  }
}

export interface ParsedCloudinaryAsset {
  publicId: string;
  resourceType: CloudinaryResourceType;
}

export function parseCloudinaryAssetFromUrl(
  secureUrl: string,
): ParsedCloudinaryAsset {
  const cloudName = getRequiredServerEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');

  let parsed: URL;
  try {
    parsed = new URL(secureUrl);
  } catch {
    throw new CloudinaryAssetError('Invalid Cloudinary URL');
  }

  if (!parsed.hostname.endsWith('res.cloudinary.com')) {
    throw new CloudinaryAssetError('Not a Cloudinary URL');
  }

  const pathParts = parsed.pathname.split('/').filter(Boolean);
  if (
    pathParts.length < 4 ||
    pathParts[0] !== cloudName ||
    pathParts[2] !== 'upload'
  ) {
    throw new CloudinaryAssetError('Invalid Cloudinary URL structure');
  }

  let startIndex = 3;
  if (/^v\d+$/.test(pathParts[3] ?? '')) {
    startIndex = 4;
  }

  const publicIdWithExt = pathParts.slice(startIndex).join('/');
  if (!publicIdWithExt) {
    throw new CloudinaryAssetError('Missing public ID in URL');
  }

  const isPortfolio =
    publicIdWithExt.startsWith('providers/') &&
    publicIdWithExt.includes('/portfolio/');
  const isRequest = publicIdWithExt.startsWith('requests/');

  if (!isPortfolio && !isRequest) {
    throw new CloudinaryAssetError('Unsupported asset path');
  }

  if (isPortfolio) {
    return {
      publicId: publicIdWithExt.replace(/\.[^/.]+$/, ''),
      resourceType: 'image',
    };
  }

  return {
    publicId: publicIdWithExt,
    resourceType: 'raw',
  };
}

export function assertCloudinaryAssetOwnership(
  publicId: string,
  uid: string,
): void {
  const portfolioPattern = new RegExp(
    `^providers/${uid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/portfolio/.+`,
  );
  const requestPattern = new RegExp(
    `^requests/${uid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/.+`,
  );

  if (!portfolioPattern.test(publicId) && !requestPattern.test(publicId)) {
    throw new CloudinaryAssetError('Unauthorized asset');
  }
}

export async function destroyCloudinaryAsset(
  publicId: string,
  resourceType: CloudinaryResourceType,
): Promise<void> {
  const resolvedType = resourceType === 'auto' ? 'image' : resourceType;

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resolvedType,
    invalidate: true,
  });

  if (result.result === 'ok' || result.result === 'not found') {
    return;
  }

  throw new CloudinaryAssetError(`Failed to delete asset: ${result.result}`);
}

export function signUploadParams({
  folder,
  resourceType,
}: SignUploadParamsInput): SignUploadParamsResult {
  const apiSecret = getRequiredServerEnv('CLOUDINARY_API_SECRET');
  const { cloudName, apiKey } = getCloudinaryConfig();
  const timestamp = Math.round(Date.now() / 1000);

  // Only sign params sent in the upload FormData. resource_type is determined by
  // the upload URL path (/image/upload, /raw/upload) and must not be signed.
  const paramsToSign: Record<string, string | number> = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    resourceType,
  };
}
