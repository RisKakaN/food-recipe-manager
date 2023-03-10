import * as admin from "firebase-admin";

const adminApp =
    admin.apps.length === 0
        ? admin.initializeApp({
              credential: admin.credential.cert({
                  projectId: process.env.FIREBASE_PROJECT_ID,
                  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                  privateKey: process.env.FIREBASE_PRIVATE_KEY,
              }),
              storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          })
        : admin.app();

const adminFirestore = adminApp.firestore();

// Configure settings once only.
try {
    adminFirestore.settings({ ignoreUndefinedProperties: true });
} catch {}

const adminStorageBucket = adminApp.storage().bucket();

export { adminFirestore, adminStorageBucket };
