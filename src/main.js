import Vue from "vue";
import App from "./App";
import vuetify from "@/plugins/vuetify";
import VueRouter from "vue-router";
import routes from "@/routes";

import firebase from "firebase";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes
});

const app = new Vue({
  ...App,
  router,
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push("/cal");
      } else {
        this.$router.push("/auth");
      }
    });
  },
  vuetify
});

app.$mount("#app");
