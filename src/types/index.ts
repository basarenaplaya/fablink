export type UserRole = 'client' | 'provider' | 'admin';

export interface UserProfile {
  id: string; // Matches Firebase Auth UID
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type ManufacturingCategory = '3d-printing' | 'cnc' | 'pcb';

export interface ProviderProfile {
  id: string; // Matches UserProfile ID
  name: string;
  category: ManufacturingCategory[];
  city: string; // e.g., "Tunis", "Sfax", "Sousse"
  description: string;
  whatsapp: string; // Expected format: 216xxxxxxxx
  images: string[]; // Cloudinary secure URLs
  verified: boolean;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  userId: string; // Client's User ID
  description: string;
  category: ManufacturingCategory;
  fileUrl?: string; // Cloudinary raw URL for files (STL, ZIP, etc.)
  fileName?: string;
  city: string; // e.g., "Tunis"
  createdAt: string;
  status: 'pending' | 'matched' | 'closed';
}

export type CloudinaryResourceType = 'image' | 'raw' | 'auto';

export interface CloudinarySignRequest {
  folder: string;
  resourceType?: CloudinaryResourceType;
}

export interface CloudinarySignResponse {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: CloudinaryResourceType;
}

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
