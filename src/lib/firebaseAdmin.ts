import "server-only";
import { getApps, initializeApp, cert, getApp, App } from "firebase-admin/app";
import { getFirestore, FieldValue as _FieldValue } from "firebase-admin/firestore";

const projectId   = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const hasAdmin = Boolean(projectId && clientEmail && privateKey);

export const admin: App | undefined = (() => {
  if (getApps().length) return getApp();
  if (hasAdmin) {
    return initializeApp({ credential: cert({ projectId: projectId!, clientEmail: clientEmail!, privateKey: privateKey! }) });
  }
  return undefined;
})();

export const db = admin ? getFirestore(admin) : ({} as any);
export const FieldValue = _FieldValue;