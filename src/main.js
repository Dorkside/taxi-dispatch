import Vue from "vue";
import App from "./components/App";
import vuetify from "@/plugins/vuetify";

const app = new Vue({
  ...App,
  vuetify
});

app.$mount("#app");
