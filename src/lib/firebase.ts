import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "taskernext-1sjfe",
  "appId": "1:888572313173:web:d85cae6c4dad6cad991edc",
  "storageBucket": "taskernext-1sjfe.firebasestorage.app",
  "apiKey": "AIzaSyAxtqlDld2JXt3PMtm4d-B7i0xib1uSiFM",
  "authDomain": "taskernext-1sjfe.firebaseapp.com",
  "messagingSenderId": "888572313173"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
