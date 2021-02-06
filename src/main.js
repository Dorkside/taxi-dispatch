import vuetify from "@/plugins/vuetify";
import routes from "@/routes";
import * as dayjs from "dayjs";
import "dayjs/locale/fr"; // load on demand
import * as firebase from "firebase";
import Vue from "vue";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginVue from "@bugsnag/plugin-vue";
import VueRouter from "vue-router";
import VueVirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import App from "./App";
import wb from "./registerServiceWorker";

Bugsnag.start({
  apiKey: "782bedc042b86332b7f8be7d4f055b0f",
  plugins: [new BugsnagPluginVue()]
});

dayjs.locale("fr");

Vue.use(VueVirtualScroller);
Vue.use(VueRouter);

if (wb) {
  Vue.prototype.$workbox = wb;

  Vue.prototype.$workbox.addEventListener("waiting", () => {
    Vue.prototype.$workbox.messageSW({ type: "SKIP_WAITING" });
  });
}

const router = new VueRouter({
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

Bugsnag.getPlugin("vue").installVueErrorHandler(Vue);

app.$mount("#app");
