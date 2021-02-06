const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

export const firebaseConfigDev = {
  apiKey: "AIzaSyC0Ltkkj6bNqtfVy2GdezOv_PO6E9jGGuM",
  authDomain: "taxi-oka-dev.firebaseapp.com",
  databaseURL: "https://taxi-oka-dev.firebaseio.com",
  projectId: "taxi-oka-dev",
  storageBucket: "taxi-oka-dev.appspot.com",
  messagingSenderId: "1028758599656",
  appId: "1:1028758599656:web:1fb7857de2bb6dee16565d"
};

export const firebaseConfig = {
  apiKey: "AIzaSyCRNvQRCDe12pOHJCNHsocWXcZAyrHD7-E",
  authDomain: "taxi-oka.firebaseapp.com",
  databaseURL: "https://taxi-oka.firebaseio.com",
  projectId: "taxi-oka",
  storageBucket: "taxi-oka.appspot.com",
  messagingSenderId: "380468446614",
  appId: "1:380468446614:web:9eb1e4a626ea5600"
};

firebase.initializeApp(
  process.env.NODE_ENV === "development" ? firebaseConfigDev : firebaseConfig
);
firebase.firestore().settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

export let db;
export let functions;

firebase
  .firestore()
  .enablePersistence({ synchronizeTabs: true })
  .then(() => {
    db = firebase.firestore();
    functions = firebase.functions();
  })
  .catch();
