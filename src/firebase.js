// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import {getStorage} from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAybRcaOQlO6Lxy7idejJELBwBnuIPmHjI",
  authDomain: "flowstate-4488a.firebaseapp.com",
  databaseURL: 'https://flowstate-4488a-default-rtdb.firebaseio.com/',
  projectId: "flowstate-4488a",
  storageBucket: "flowstate-4488a.appspot.com",
  messagingSenderId: "296148434071",
  appId: "1:296148434071:web:8cc1392807df3e8ce0fdd2",
  measurementId: "G-QFEK3HRKXD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const storage = getStorage(app);
export {database, storage};