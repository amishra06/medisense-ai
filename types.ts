
export enum UrgencyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  EMERGENCY = 'EMERGENCY'
}

export interface DiagnosticMedia {
  dataUrl: string;
  type: string;
  name: string;
}

export interface PreliminaryAssessment {
  summary: string;
  reportHtml: string;
  potentialConditions: string[];
  urgency: UrgencyLevel;
  redFlags: string[];
  nextSteps: string[];
  disclaimer: string;
  groundingSources?: Array<{ title: string; uri: string }>;
}

export interface PatientData {
  name: string;
  age: string;
  gender: string;
  symptoms: string;
  duration: string;
  history: string;
}

export interface ExtractedPatientInfo {
  name?: string;
  age?: string;
  gender?: string;
  symptoms?: string;
  duration?: string;
  history?: string;
}

export interface UserReport {
  id: string;
  userId: string;
  createdAt: any; // Firebase Timestamp
  media: DiagnosticMedia[];
  patientData: PatientData;
  assessment: PreliminaryAssessment;
  status: 'draft' | 'completed';
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
