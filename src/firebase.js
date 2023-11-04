import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHvv-UrtlSbqErfVKopruh7cy6eCaJ8MY",
  authDomain: "fir-crud-eb63e.firebaseapp.com",
  projectId: "fir-crud-eb63e",
  storageBucket: "fir-crud-eb63e.appspot.com",
  messagingSenderId: "794739582214",
  appId: "1:794739582214:web:beba189b07446b140caa87"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db; 