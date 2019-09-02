import Vue from "vue";
import App from "./App";
import vuetify from "@/plugins/vuetify";
import VueRouter from "vue-router";
import routes from "@/routes";

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

const app = new Vue({
  ...App,
  router,
  vuetify
});

app.$mount("#app");
