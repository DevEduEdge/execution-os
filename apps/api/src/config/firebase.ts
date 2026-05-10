import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "./env.js";

function getFirebaseAuth() {
  if (!env.firebaseProjectId || !env.firebaseClientEmail || !env.firebasePrivateKey) {
    throw new Error("Firebase Admin credentials are missing.");
  }

  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId: env.firebaseProjectId,
        clientEmail: env.firebaseClientEmail,
        privateKey: env.firebasePrivateKey
      })
    });

  return getAuth(app);
}

export async function verifyFirebaseToken(token: string) {
  return getFirebaseAuth().verifyIdToken(token);
}
