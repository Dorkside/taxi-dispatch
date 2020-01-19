import vuetify from "@/plugins/vuetify";
import routes from "@/routes";
import * as dayjs from "dayjs";
import "dayjs/locale/fr"; // load on demand
import * as firebase from "firebase";
import Vue from "vue";
import VueRouter from "vue-router";
import VueVirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import App from "./App";

dayjs.locale("fr");

// import wb from "./registerServiceWorker";

// Vue.prototype.$workbox = wb;

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
  } else if (to.path !== "/auth") {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        next();
      } else {
        next({ path: "/journee" });
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
