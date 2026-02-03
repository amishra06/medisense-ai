import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, getDoc, query, orderBy, doc, deleteDoc, Timestamp, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { UserReport } from '../types';

// Use environment variables if available (e.g. via build tools) or the provided hardcoded credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase as a singleton. 
// We check getApps().length to prevent "Firebase App named '[DEFAULT]' already exists" error.
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services immediately using the shared app instance.
// This ensures that 'auth', 'db', and 'storage' are registered against the same Firebase context.
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logOut = () => signOut(auth);

export const saveReport = async (userId: string, report: Omit<UserReport, 'id' | 'createdAt'>) => {
  try {
    const reportsCol = collection(db, 'users', userId, 'reports');

    // 1. Manually map and truncate to prevent size/entity errors
    const finalData = {
      userId: String(report.userId),
      status: String(report.status),
      media: (report.media || []).map(m => {
        let url = String(m.dataUrl || '');
        if (url.length > 500000) {
          console.warn(`Reducing oversized file: ${m.name}`);
          url = url.substring(0, 500) + "...[TRUNCATED_DUE_TO_SIZE]";
        }
        return {
          dataUrl: url,
          type: String(m.type || ''),
          name: String(m.name || '')
        };
      }).filter(m => m.dataUrl),
      patientData: {
        name: String(report.patientData.name || ''),
        age: String(report.patientData.age || ''),
        gender: String(report.patientData.gender || ''),
        symptoms: String(report.patientData.symptoms || ''),
        duration: String(report.patientData.duration || ''),
        history: String(report.patientData.history || '')
      },
      assessment: {
        summary: String(report.assessment.summary || ''),
        reportHtml: String(report.assessment.reportHtml || ''),
        potentialConditions: (report.assessment.potentialConditions || []).map(c => String(c)),
        urgency: String(report.assessment.urgency || ''),
        redFlags: (report.assessment.redFlags || []).map(f => String(f)),
        nextSteps: (report.assessment.nextSteps || []).map(s => String(s)),
        disclaimer: String(report.assessment.disclaimer || ''),
        groundingSources: (report.assessment.groundingSources || []).map(source => ({
          title: String(source?.title || ''),
          uri: String(source?.uri || '')
        }))
      },
      createdAt: Timestamp.now(),
    };

    const mediaSize = finalData.media.reduce((acc, m) => acc + m.dataUrl.length, 0);
    console.log(`Final check - Total media size: ${(mediaSize / 1024).toFixed(2)} KB`);

    const docRef = await addDoc(reportsCol, finalData);
    return docRef.id;
  } catch (error: any) {
    console.error("CRITICAL Firestore Save Error:", error);
    throw error;
  }
};


export const getUserReports = async (userId: string): Promise<UserReport[]> => {
  try {
    const reportsCol = collection(db, 'users', userId, 'reports');
    const q = query(reportsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserReport));
  } catch (e) {
    console.warn("Firestore access error. Check your Firebase config and security rules.");
    return [];
  }
};

export const deleteReport = async (userId: string, reportId: string) => {
  try {
    const docRef = doc(db, 'users', userId, 'reports', reportId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
};

export default app;

export const createShareLink = async (reportId: string, userId: string, expiryHours: number) => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiryHours);

  const shareData = {
    reportId,
    userId,
    createdAt: Timestamp.now(),
    expiresAt: Timestamp.fromDate(expiresAt),
    accessCount: 0
  };

  const docRef = await addDoc(collection(db, 'sharedReports'), shareData);
  return docRef.id;
};

export const getSharedReport = async (shareId: string) => {
  const shareDoc = await getDoc(doc(db, 'sharedReports', shareId));
  if (!shareDoc.exists()) throw new Error("Link invalid");

  const data = shareDoc.data();
  if (data.expiresAt.toDate() < new Date()) throw new Error("Link expired");

  // Fetch actual report
  const reportDoc = await getDoc(doc(db, 'users', data.userId, 'reports', data.reportId));
  if (!reportDoc.exists()) throw new Error("Report not found");

  return { ...reportDoc.data(), id: reportDoc.id, sharedBy: data.userId };
};