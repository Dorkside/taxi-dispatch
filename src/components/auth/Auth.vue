<template lang="html">
  <div class="root amber">
    <div class="splash d-flex flex-row flex-wrap align-center justify-center">
      <div class="bg-gradient"></div>
      <div class="d-flex flex-column flex-1 flex-shrink-0">
        <h1 class="stencil deep-orange--text text--darken-3">
          XI&nbsp;DRIVER
        </h1>
      </div>
      <div class="d-flex flex-column flex-1 flex-shrink-0 auth-container">
        <h2>Connexion</h2>
        <div id="firebaseui-auth-container"></div>
        <div id="recaptcha-container"></div>
      </div>
    </div>
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

export default {
  name: "Auth",
  mounted() {
    console.log("ENV", process.env.NODE_ENV);
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
<style scoped lang="scss">
.root {
  width: 100%;
  height: 100%;
}
.splash {
  width: 100%;
  height: 100%;
  max-width: 900px;
  margin: 0 auto;

  h1 {
    font-size: 4rem;
  }

  .auth-container {
    max-width: 100%;
    padding: 16px;
  }

  .bg-gradient {
    background: linear-gradient(
      to left bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.03) 50%,
      rgba(0, 0, 0, 0.1) 100%
    );
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
}
</style>
