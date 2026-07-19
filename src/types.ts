/**
 * ClariMed Type Definitions
 * Shared types for frontend and backend
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  plan: 'free' | 'premium';
}

export interface Analysis {
  id: string;
  userId: string;
  reportName: string;
  reportType: string; // 'image/png' | 'image/jpeg' | 'application/pdf' | etc.
  rawText: string;    // Extracted medical terms
  explanation: string; // Gemini-generated warm human-friendly paragraphs
  language: 'en' | 'hi' | 'te' | 'ta'; // English, Hindi, Telugu, Tamil
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface AnalysisResponse {
  success: boolean;
  message: string;
  analysis?: Analysis;
  history?: Analysis[];
}
