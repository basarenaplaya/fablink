export type UserRole = 'client' | 'provider' | 'admin';

export interface UserProfile {
  id: string; // Matches Firebase Auth UID
  name: string;
  email: string;
  role: UserRole;
  whatsapp?: string; // Expected format: 216xxxxxxxx
  createdAt: string;
  updatedAt?: string;
}

export type ManufacturingCategory = '3d-printing' | 'cnc' | 'pcb';

export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface ProviderReview {
  id: string;
  providerId: string;
  clientId: string;
  clientName: string;
  rating: ReviewRating;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProviderProfile {
  id: string; // Matches UserProfile ID
  name: string;
  category: ManufacturingCategory[];
  city: string; // e.g., "Tunis", "Sfax", "Sousse"
  description: string;
  whatsapp: string; // Expected format: 216xxxxxxxx
  images: string[]; // Cloudinary secure URLs
  verified: boolean;
  ratingAverage?: number;
  ratingCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceRequest {
  id: string;
  userId: string; // Client's User ID
  clientName: string;
  clientWhatsapp: string; // Expected format: 216xxxxxxxx
  title: string;
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
