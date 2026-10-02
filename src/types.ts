/**
 * Care Saathi Type Definitions
 * Shared types for frontend and backend
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  patientId?: string;
  abhaId?: string;
  role?: 'patient' | 'asha_worker' | 'caregiver';
  plan?: 'free' | 'premium';
}

export interface ReportParameter {
  name: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  status: 'normal' | 'low' | 'high' | 'abnormal' | 'borderline' | 'unknown';
  interpretation?: string;
}

export interface MedicalTermExplanation {
  term: string;
  simpleMeaning: string;
}

export interface StructuredReportData {
  summary: string; // What does this report contain?
  reportTypeDetected: string;
  testDate?: string;
  patientName?: string;
  parameters: ReportParameter[]; // Important values
  abnormalParameters: ReportParameter[]; // Values outside provided reference range
  termExplanations: MedicalTermExplanation[]; // What these terms generally mean
  doctorQuestions: string[]; // Questions you may want to ask your doctor
  seekImmediateHelpWhen: string[]; // When to seek professional medical help
  educationalContext: string; // General educational context
  safetyDisclaimer: string; // Safety assurance
}

export type SyncStatus = 'synced' | 'pending' | 'syncing' | 'failed';

export interface Analysis {
  id: string;
  userId: string;
  reportName: string;
  reportType: string;
  rawText: string;
  explanation: string;
  language: 'en' | 'hi' | 'te';
  createdAt: string;
  updatedAt?: string;
  doctorNotes?: string;
  followUpDate?: string;
  structuredData?: StructuredReportData;
  syncStatus?: SyncStatus;
  isLocalOfflineReport?: boolean;
  isOfflineFallback?: boolean;
  translations?: {
    en?: { rawText: string; explanation: string; structuredData?: StructuredReportData };
    hi?: { rawText: string; explanation: string; structuredData?: StructuredReportData };
    te?: { rawText: string; explanation: string; structuredData?: StructuredReportData };
  };
}

export interface SyncQueueItem {
  id?: number;
  action: 'create_report' | 'update_notes' | 'delete_report';
  entityId: string;
  payload: any;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed';
}

export interface FollowUpNoteRecord {
  id: string;
  reportId: string;
  doctorNotes: string;
  followUpDate?: string;
  timestamp: number;
  syncStatus: SyncStatus;
}

export interface HealthcareFacility {
  id: string;
  name: string;
  type: 'Sub-Centre' | 'Primary Health Centre (PHC)' | 'Community Health Centre (CHC)' | 'Sub-District Hospital' | 'District Hospital' | 'Ayushman Arogya Mandir';
  location: string;
  distanceKm: number;
  services: string[];
  contact: string;
  openingHours: string;
  isEmergency24x7: boolean;
  isAyushmanEmpaneled: boolean;
  hasFreeMedicines: boolean;
  doctorsAvailable: string;
  referralGuidance: string;
  needs: Array<
    | 'general'
    | 'primary'
    | 'emergency'
    | 'diagnostic'
    | 'maternal'
    | 'child'
    | 'specialist'
    | 'pharmacy'
    | 'followup'
  >;
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
  isFallback?: boolean;
}
