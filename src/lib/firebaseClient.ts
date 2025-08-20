"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function hasAll(v: Record<string, any>) {
  return !!(v.apiKey && v.authDomain && v.projectId && v.appId);
}

/** Export para compatibilidad con tu AuthContext: */
export const app: any = (() => {
  if (!hasAll(cfg)) {
    if (process.env.NODE_ENV !== "production") console.warn("[firebaseClient] Missing client env, app not initialized");
    return undefined;
  }
  try {
    return getApps().length ? getApps()[0] : initializeApp(cfg as any);
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.warn("[firebaseClient] init failed", e);
    return undefined;
  }
})();

export const auth = (() => {
  try { return app ? getAuth(app) : null; } catch { return null; }
})();

export const clientDb = (() => {
  try { return app ? getFirestore(app) : null; } catch { return null; }
})();