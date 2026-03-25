import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

// Some projects still use the .appspot.com format for storage buckets
const configWithFallbackBucket = {
  ...firebaseConfig,
  storageBucket: firebaseConfig.storageBucket?.replace('.firebasestorage.app', '.appspot.com')
};

const app = initializeApp(configWithFallbackBucket);

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Set a shorter retry time (10 seconds) so uploads fail fast if Storage is not initialized
storage.maxUploadRetryTime = 10000;
