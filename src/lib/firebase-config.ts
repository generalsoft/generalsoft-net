/**
 * Public Firebase web configuration for the contact form.
 *
 * This module intentionally has **no dependency on the Firebase SDK** so the
 * site can cheaply check whether Firebase is configured without downloading the
 * SDK. `src/lib/firebase.ts` (which imports the SDK) is loaded on demand when
 * the visitor actually submits the contact form.
 *
 * The values are injected at build time from `PUBLIC_FIREBASE_*` environment
 * variables (see `.env.example`). Only the public web config belongs here —
 * never Admin SDK service-account credentials.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/** `true` when the minimum Firebase web config is available at build time. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);
