import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


// Firebase Configuration
const firebaseConfig = {

  apiKey: "AIzaSyClo0SuF2EIpd_UoZLJzfUeEyZlkvAEmJc",

  authDomain: "tailora-1e78d.firebaseapp.com",

  projectId: "tailora-1e78d",

  storageBucket: "tailora-1e78d.firebasestorage.app",

  messagingSenderId: "328618327353",

  appId: "1:328618327353:web:a86073a245c44686627ce8"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Firestore Database
const db = getFirestore(app);


// Firebase Storage
const storage = getStorage(app);


// Export
export { db, storage };