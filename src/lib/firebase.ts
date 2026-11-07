/**
 * Firebase client used by the contact form.
 *
 * The SDK is only imported here so pages can load it on demand
 * (`await import('../lib/firebase')`) instead of shipping it with the initial
 * paint. The public web config lives in `src/lib/firebase-config.ts`.
 */
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './firebase-config';

export { isFirebaseConfigured };

/** Firestore collection that stores contact form submissions. */
export const CONTACT_COLLECTION = 'contactMessages';

/** Source tag written with every document, useful for filtering in the console. */
export const CONTACT_SOURCE = 'website-contact-form';

export interface ContactMessage {
  name: string;
  email: string;
  /** Optional phone number. */
  phone?: string;
  /** Optional company name. */
  company?: string;
  /** Optional "I'm interested in" selection. */
  interest?: string;
  message: string;
}

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Set the PUBLIC_FIREBASE_* environment variables before building the site.'
    );
  }

  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }

  return app;
}

/** Lazily creates (and caches) the Firestore instance. */
export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }

  return db;
}

/**
 * Writes a contact form submission to Firestore.
 *
 * @returns the id of the newly created document.
 */
export async function submitContactMessage(input: ContactMessage): Promise<string> {
  const docRef = await addDoc(collection(getDb(), CONTACT_COLLECTION), {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    // Optional fields are stored as `null` so every document keeps the same shape.
    phone: input.phone?.trim() || null,
    company: input.company?.trim() || null,
    interest: input.interest?.trim() || null,
    message: input.message.trim(),
    status: 'new',
    source: CONTACT_SOURCE,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}
