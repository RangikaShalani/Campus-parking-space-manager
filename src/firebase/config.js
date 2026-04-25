import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDs0pBekqY80Az-j59H_Hoe_ho9hQzARmo",
    authDomain: "campus-parking-space.firebaseapp.com",
    projectId: "campus-parking-space",
    storageBucket: "campus-parking-space.firebasestorage.app",
    messagingSenderId: "18567038546",
    appId: "1:18567038546:web:aff9a086b8b90342a3018b",
    measurementId: "G-Z8KV7GNXY1"
};

const app = initializeApp(firebaseConfig);

export default app;