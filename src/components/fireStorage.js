import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAu_8oVSaXp2ZsWEquyfCjCJd6qkSZoJDs",
    authDomain: "test-931b4.firebaseapp.com",
    projectId: "test-931b4",
    storageBucket: "test-931b4.appspot.com",
    messagingSenderId: "504567285553",
    appId: "1:504567285553:web:a0d8ce97ca278942a45210"
};

// Initialize Firebase
const fireApp = initializeApp(firebaseConfig);
export const storage = getStorage(fireApp);
export default fireApp;
