import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCjo5b68A32L6i4epqjbxMcudd1CaDXlQM",
    authDomain: "geneco-e48a0.firebaseapp.com",
    projectId: "geneco-e48a0",
    storageBucket: "geneco-e48a0.appspot.com",
    messagingSenderId: "607904316014",
    appId: "1:607904316014:web:c8479783c2562ce325c47f"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth, GoogleAuthProvider, signInWithPopup, getAuth, onAuthStateChanged };
