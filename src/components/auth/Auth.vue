<template lang="html">
  <div id="firebaseui-auth-container"></div>
</template>
<script>
import firebase from "firebase";
import firebaseui from "../../plugins/npm__fr";
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
