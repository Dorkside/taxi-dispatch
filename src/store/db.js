const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

export const firebaseConfig = {
  apiKey: "AIzaSyCRNvQRCDe12pOHJCNHsocWXcZAyrHD7-E",
  authDomain: "taxi-oka.firebaseapp.com",
  databaseURL: "https://taxi-oka.firebaseio.com",
  projectId: "taxi-oka",
  storageBucket: "taxi-oka.appspot.com",
  messagingSenderId: "380468446614",
  appId: "1:380468446614:web:9eb1e4a626ea5600"
};

// Initialize Cloud Firestore through Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
