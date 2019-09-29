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

router.beforeEach((to, from, next) => {
  console.log(to);
  if (to.path !== "/auth") {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        next({ path: "/auth" });
      } else {
        next();
      }
    });
  } else next();
});

const app = new Vue({
  ...App,
  router,
  created() {},
  vuetify
});

app.$mount("#app");
