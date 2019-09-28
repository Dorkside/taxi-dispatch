<template lang="html">
  <v-container align="center" justify="center">
    <div id="firebaseui-auth-container"></div>
  </v-container>
</template>
<script>
import firebase from "firebase";
import firebaseui from "../../lib/npm__fr";

export default {
  name: "Auth",
  mounted() {
    var uiConfig = {
      signInSuccessUrl: "/success",
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
    };
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};
</script>
