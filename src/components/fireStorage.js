import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyDHPvFj8G2q-7zz6-U_dfI-q609knwILkw",
  authDomain: "ipa-react.firebaseapp.com",
  projectId: "ipa-react",
  storageBucket: "ipa-react.appspot.com",
  messagingSenderId: "362140131363",
  appId: "1:362140131363:web:955d7da869aa2e44bed196"
};

// Initialize Firebase
const fireApp = initializeApp(firebaseConfig);
export const storage = getStorage(fireApp);
export default fireApp;
