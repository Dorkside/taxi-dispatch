<template lang="html">
  <div align="center" justify="center">
    <div id="firebaseui-auth-container"></div>
    <div id="recaptcha-container"></div>
  </div>
</template>
<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

const firebaseConfigDev = {
  apiKey: "AIzaSyC0Ltkkj6bNqtfVy2GdezOv_PO6E9jGGuM",
  authDomain: "taxi-oka-dev.firebaseapp.com",
  databaseURL: "https://taxi-oka-dev.firebaseio.com",
  projectId: "taxi-oka-dev",
  storageBucket: "taxi-oka-dev.appspot.com",
  messagingSenderId: "1028758599656",
  appId: "1:1028758599656:web:1fb7857de2bb6dee16565d"
};

const firebaseConfig = {
  apiKey: "AIzaSyCRNvQRCDe12pOHJCNHsocWXcZAyrHD7-E",
  authDomain: "taxi-oka.firebaseapp.com",
  databaseURL: "https://taxi-oka.firebaseio.com",
  projectId: "taxi-oka",
  storageBucket: "taxi-oka.appspot.com",
  messagingSenderId: "380468446614",
  appId: "1:380468446614:web:9eb1e4a626ea5600"
};

export default {
  name: "Auth",
  mounted() {
    firebase.initializeApp(
      process.env.NODE_ENV === "development"
        ? firebaseConfigDev
        : firebaseConfig
    );
    firebase.auth().useDeviceLanguage();

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    );

    var uiConfig = {
      signInSuccessUrl: "/journee",
      signInOptions: [firebase.auth.PhoneAuthProvider.PROVIDER_ID]
    };
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>
