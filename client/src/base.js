import firebase from "firebase/compat/app";
import "firebase/auth";

const firbaseApp = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBAE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBAE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBAE_PROJ_ID,
  storageBucket: process.env.REACT_APP_FIREBAE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBAE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBAE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBAE_MEASUREMENT_ID,
});

export default firbaseApp;
