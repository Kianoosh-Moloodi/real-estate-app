// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCsYXXFzEqAtp7IdPP3WYKwWe4QG64LzJM',
  authDomain: 'my-real-estate-app-f654c.firebaseapp.com',
  projectId: 'my-real-estate-app-f654c',
  storageBucket: 'my-real-estate-app-f654c.appspot.com',
  messagingSenderId: '1073546193851',
  appId: '1:1073546193851:web:b1c2c7120478132ac9329e',
};

initializeApp(firebaseConfig);
export const db = getFirestore();
