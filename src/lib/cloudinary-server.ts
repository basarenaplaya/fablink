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

export function signUploadParams({
  folder,
  resourceType,
}: SignUploadParamsInput): SignUploadParamsResult {
  const apiSecret = getRequiredServerEnv('CLOUDINARY_API_SECRET');
  const { cloudName, apiKey } = getCloudinaryConfig();
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign: Record<string, string | number> = {
    timestamp,
    folder,
  };

  // resource_type is conveyed by the upload URL path (/image/upload, /raw/upload).
  // Including it in the signature without sending it in FormData breaks uploads.
  if (resourceType === 'raw' || resourceType === 'auto') {
    paramsToSign.resource_type = resourceType;
  }

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
