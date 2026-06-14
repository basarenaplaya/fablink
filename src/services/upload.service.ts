import {
  MAX_UPLOAD_BYTES,
  type CloudinarySignRequest,
  type CloudinarySignResponse,
} from '@/types';
import { MAX_PORTFOLIO_IMAGES } from '@/lib/constants';

interface CloudinaryUploadApiResponse {
  secure_url: string;
}

interface CloudinaryUploadErrorResponse {
  error?: {
    message?: string;
  };
}

export class UploadServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'UploadServiceError';
  }
}

/**
 * Folder conventions (enforced by API route regex + caller discipline):
 * - providers/{uid}/portfolio
 * - requests/{uid}/drafts
 * - requests/{uid}/{requestId}
 */
export function validateFileSize(
  file: File,
  maxBytes: number = MAX_UPLOAD_BYTES,
): void {
  if (file.size > maxBytes) {
    throw new UploadServiceError(
      `File exceeds maximum size of ${maxBytes} bytes`,
    );
  }
}

export async function requestCloudinarySignature(
  body: CloudinarySignRequest,
  idToken: string,
): Promise<CloudinarySignResponse> {
  const response = await fetch('/api/cloudinary-sign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = 'Failed to request Cloudinary signature';
    try {
      const errorBody = (await response.json()) as { error?: string };
      if (errorBody.error) {
        message = errorBody.error;
      }
    } catch {
      // Use default message when error body is not JSON
    }
    throw new UploadServiceError(message, response.status);
  }

  return response.json() as Promise<CloudinarySignResponse>;
}

export async function uploadFileToCloudinary(
  file: File,
  sign: CloudinarySignResponse,
): Promise<string> {
  validateFileSize(file);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sign.apiKey);
  formData.append('timestamp', String(sign.timestamp));
  formData.append('signature', sign.signature);
  formData.append('folder', sign.folder);

  // resource_type is set by the upload URL segment (/image/upload, /raw/upload).
  const uploadUrl = `https://api.cloudinary.com/v1_1/${sign.cloudName}/${sign.resourceType}/upload`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  const responseBody = (await response.json()) as
    | CloudinaryUploadApiResponse
    | CloudinaryUploadErrorResponse;

  if (!response.ok) {
    const errorBody = responseBody as CloudinaryUploadErrorResponse;
    const cloudinaryMessage = errorBody.error?.message;
    throw new UploadServiceError(
      cloudinaryMessage ?? 'Cloudinary upload failed',
      response.status,
    );
  }

  const data = responseBody as CloudinaryUploadApiResponse;
  if (!data.secure_url) {
    throw new UploadServiceError('Cloudinary response missing secure_url');
  }

  return data.secure_url;
}

const IMAGE_MIME_PREFIX = 'image/';

export function validatePortfolioFiles(files: File[]): void {
  if (files.length === 0) {
    throw new UploadServiceError('At least one portfolio image is required');
  }

  if (files.length > MAX_PORTFOLIO_IMAGES) {
    throw new UploadServiceError(
      `Maximum ${MAX_PORTFOLIO_IMAGES} portfolio images allowed`,
    );
  }

  for (const file of files) {
    if (!file.type.startsWith(IMAGE_MIME_PREFIX)) {
      throw new UploadServiceError('Portfolio files must be images');
    }
    validateFileSize(file);
  }
}

export async function uploadPortfolioImages(
  files: File[],
  userId: string,
  idToken: string,
): Promise<string[]> {
  validatePortfolioFiles(files);

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const signature = await requestCloudinarySignature(
      {
        folder: `providers/${userId}/portfolio`,
        resourceType: 'image',
      },
      idToken,
    );

    const secureUrl = await uploadFileToCloudinary(file, signature);
    uploadedUrls.push(secureUrl);
  }

  return uploadedUrls;
}

const REQUEST_FILE_EXTENSIONS = new Set([
  '.stl',
  '.step',
  '.stp',
  '.iges',
  '.igs',
  '.obj',
  '.3mf',
  '.amf',
  '.zip',
  '.rar',
  '.7z',
  '.gerber',
  '.gbr',
  '.dxf',
  '.dwg',
  '.fcstd',
  '.f3d',
  '.skp',
]);

const REQUEST_MIME_PREFIXES = [
  'model/',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-zip',
  'application/octet-stream',
  'application/vnd.ms-pki.stl',
  'application/sla',
];

function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1) {
    return '';
  }
  return fileName.slice(lastDot).toLowerCase();
}

function isAllowedRequestFile(file: File): boolean {
  const extension = getFileExtension(file.name);

  if (REQUEST_FILE_EXTENSIONS.has(extension)) {
    return true;
  }

  if (!file.type || file.type === 'application/octet-stream') {
    return false;
  }

  return REQUEST_MIME_PREFIXES.some(
    (prefix) => file.type.startsWith(prefix) || file.type === prefix,
  );
}

export function validateRequestFile(file: File): void {
  if (!isAllowedRequestFile(file)) {
    throw new UploadServiceError(
      'File must be STL, STEP, Gerber, ZIP, or another supported CAD format',
    );
  }

  validateFileSize(file);
}

export async function uploadRequestFile(
  file: File,
  userId: string,
  requestId: string,
  idToken: string,
): Promise<{ fileUrl: string; fileName: string }> {
  validateRequestFile(file);

  const signature = await requestCloudinarySignature(
    {
      folder: `requests/${userId}/${requestId}`,
      resourceType: 'raw',
    },
    idToken,
  );

  const fileUrl = await uploadFileToCloudinary(file, signature);

  return { fileUrl, fileName: file.name };
}
