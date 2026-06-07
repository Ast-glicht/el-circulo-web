import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  initializeFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDfuCbvpM7VPDNfUaoM5rS7BAcXzpzHjuo",
  authDomain: "el-circulo-web-nic.firebaseapp.com",
  projectId: "el-circulo-web-nic",
  storageBucket: "el-circulo-web-nic.firebasestorage.app",
  messagingSenderId: "148557517042",
  appId: "1:148557517042:web:85c0613f734592edcc406b"
};

const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false
});

window.FirebaseDB = {
  db,
  doc,
  getDoc,
  setDoc
};

window.dispatchEvent(new Event("firebase-ready"));