import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
 } from "firebase/storage";

//add your api key firebase credentials for image uploading
const firebaseConfig = {

};


let app;
let analytics;
let storage;

try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}


export {storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
}



