<template lang="html">
  <v-container align="center" justify="center">
    <div id="firebaseui-auth-container"></div>
    <div id="recaptcha-container"></div>
  </v-container>
</template>
<script>
import firebase from "firebase";
import firebaseui from "../../lib/npm__fr";

export default {
  name: "Auth",
  mounted() {
    firebase.auth().useDeviceLanguage();

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    );

    var uiConfig = {
      signInSuccessUrl: "/cal/journee",
      signInOptions: [firebase.auth.PhoneAuthProvider.PROVIDER_ID]
    };
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>
