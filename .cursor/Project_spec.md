# PROJECT SPECIFICATION: Tunisia Manufacturing Marketplace (MVP)

## 1. Vision & Core Problem
A lightweight web marketplace connecting clients in Tunisia with vetted local manufacturing providers (3D Printing, CNC, PCB Manufacturing) to enable fast discovery and instant contact via WhatsApp.

### Today's Problem in Tunisia:
- Providers are scattered across unorganized Facebook Groups and Instagram pages.
- Posts and portfolios get lost in feeds over time.
- No curation, leading to high risks of low-quality work or scams.
- No structured central discovery mechanism.

### The Solution:
A clean, curated directory app that centralizes vetted providers, establishes credibility via portfolio images, tracks real user demand, and relies on WhatsApp for frictionless transaction communication.

---

## 2. Core MVP Goal
Enable a user to find a vetted manufacturing provider and initiate contact with them on WhatsApp in under 30 seconds.

---

## 3. Tech Stack
- **Frontend Framework**: Next.js 15+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui (Default Dark/Slate theme, iOS Premium aesthetic)
- **Database**: Firestore Database
- **Authentication**: Firebase Authentication (Google login primary, phone optional later)
- **Media Storage**: Cloudinary (for portfolio images and client request files)
- **Upload Security**: Secure Signed Uploads (using server-side API or Server Actions)
- **Messaging Integration**: WhatsApp Universal Deep Links (`https://wa.me/216xxxxxxxx?text=...`)

---

## 4. Firestore Database Schema
All dates are stored as ISO 8601 strings.

### `users` collection
```typescript
{
  id: string;          // Matches Firebase Auth UID
  name: string;
  email: string;
  role: 'client' | 'provider' | 'admin';
  createdAt: string;
}
providers collection
code
TypeScript
{
  id: string;                  // Matches user ID
  name: string;                // Shop or provider name
  category: ('3d-printing' | 'cnc' | 'pcb')[];
  city: string;                // e.g., "Tunis", "Sfax", "Sousse", "Nabeul", "Bizerte"
  description: string;
  whatsapp: string;            // Must match pattern: 216xxxxxxxx (no spaces, no +)
  images: string[];            // Array of Cloudinary secure URLs
  verified: boolean;           // Default: false, toggled by Admin
  createdAt: string;
}
requests collection
code
TypeScript
{
  id: string;
  userId: string;              // Client ID
  description: string;
  category: '3d-printing' | 'cnc' | 'pcb';
  fileUrl?: string;            // Cloudinary raw upload URL (optional)
  fileName?: string;           // Original name of file (optional)
  city: string;
  createdAt: string;
  status: 'pending' | 'matched' | 'closed';
}
5. Screen & Feature Specifications
🔐 1. Authentication Page
Clean, premium layout featuring a "Continue with Google" CTA.
Initiates Firebase Auth state.
Post-login: Redirects to onboarding form if no role is selected, or directly to the dashboard/marketplace.
🏠 2. Home Screen
Premium glassmorphic category selector cards (3D Printing, CNC, PCB Manufacturing).
Quick search bar.
Featured/Verified Providers slider (mobile swipe friendly).
🔍 3. Provider Marketplace (Directory)
Vertical feed of provider cards optimized for mobile screens.
Filters: Category toggle buttons, City dropdown (Tunisian governorates).
Cards: Show name, primary services, city, verification badge, short snippet of description, and "View Profile" action.
👤 4. Provider Profile Screen
Premium dark interface featuring high-contrast image carousel of their portfolio.
Business description, list of machinery/services.
Sticky mobile bottom CTA: 📲 "Contact on WhatsApp".
📲 5. WhatsApp Redirection System (Core Feature)
On clicking the contact CTA:
Fire a background analytics event to Firestore (analytics_clicks) tracking the provider ID, categories, and client ID.
Construct the universal link with pre-filled encoded text:
https://wa.me/216xxxxxxxx?text=Hi!%20I%20found%20you%20on%20[AppName].%20I%20need%20a%20manufacturing%20service%20for...
Smoothly redirect the client.
📝 6. Request Placement Flow
Form allowing clients to submit a project description, select category, upload manufacturing files (STL, CAD, Gerber zip), and choose target city.
Maximum file size limit: 20MB.
Uploads securely sign requests via Cloudinary before upload.
🧑‍🏭 7. Provider Onboarding
Profile setup form for new providers: Name, WhatsApp number, services, city, description, and portfolio upload.
Submissions are marked as verified: false by default, awaiting Admin validation.
6. Scope Bounds (Out of Scope for MVP - Do NOT Build)
NO In-App Payments.
NO In-App Chat system (handled by WhatsApp).
NO Reviews/Ratings engine (Phase 2).
NO AI Matching systems.
NO Escrow or delivery handling.
7. Crucial UX Standards
tactile Buttons: Active states must scale down visually on tap (active:scale-95).
Touch Targets: Minimum tap surface of 44px on mobile.
No Cumulative Layout Shift (CLS): Use skeleton loading states when fetching data from Firebase to prevent page jumping.
code
Code
