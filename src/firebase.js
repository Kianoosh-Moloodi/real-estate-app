// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC0EPEgxpvcRrjtml-U7QEkJLz1gNg1Xoc',
  authDomain: 'my-real-estate-app-c7177.firebaseapp.com',
  projectId: 'my-real-estate-app-c7177',
  storageBucket: 'my-real-estate-app-c7177.appspot.com',
  messagingSenderId: '359142883468',
  appId: '1:359142883468:web:4fff2707db81bd39133ba9',
};

initializeApp(firebaseConfig);

export const db = getFirestore();
