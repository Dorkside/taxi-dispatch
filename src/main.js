import Vue from "vue";
import App from "./App";
import vuetify from "@/plugins/vuetify";
import VueRouter from "vue-router";
import VueVirtualScroller from "vue-virtual-scroller";
import routes from "@/routes";

import firebase from "firebase";

import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

Vue.use(VueVirtualScroller);

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
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
