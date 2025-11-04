import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyAsOxU-N_i9arQDPiWxlFIXWSWw_QSEPno",
    authDomain: "prepwise-6faa1.firebaseapp.com",
    projectId: "prepwise-6faa1",
    storageBucket: "prepwise-6faa1.firebasestorage.app",
    messagingSenderId: "765898731207",
    appId: "1:765898731207:web:88f41296f958d1ebf518e2",
    measurementId: "G-QCG75CEZYK"
};
const app = !getApps.length ? initializeApp(firebaseConfig):getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);


