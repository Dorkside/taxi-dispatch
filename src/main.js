import vuetify from "@/plugins/vuetify";
import routes from "@/routes";
import * as dayjs from "dayjs";
import "dayjs/locale/fr";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Vue from "vue";
import VueRouter from "vue-router";
import VueVirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import App from "./App";
import wb from "./registerServiceWorker";
import { initializeApp } from "firebase/app";
import { enableIndexedDbPersistence } from "firebase/firestore";
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

export const firebaseConfigDev = {
  apiKey: "AIzaSyC0Ltkkj6bNqtfVy2GdezOv_PO6E9jGGuM",
  authDomain: "taxi-oka-dev.firebaseapp.com",
  databaseURL: "https://taxi-oka-dev.firebaseio.com",
  projectId: "taxi-oka-dev",
  storageBucket: "taxi-oka-dev.appspot.com",
  messagingSenderId: "1028758599656",
  appId: "1:1028758599656:web:1fb7857de2bb6dee16565d"
};

export const firebaseConfig = {
  apiKey: "AIzaSyCRNvQRCDe12pOHJCNHsocWXcZAyrHD7-E",
  authDomain: "taxi-oka.firebaseapp.com",
  databaseURL: "https://taxi-oka.firebaseio.com",
  projectId: "taxi-oka",
  storageBucket: "taxi-oka.appspot.com",
  messagingSenderId: "380468446614",
  appId: "1:380468446614:web:9eb1e4a626ea5600"
};

const firebaseApp = initializeApp(
  process.env.NODE_ENV === "development" ? firebaseConfigDev : firebaseConfig
);

const db = initializeFirestore(firebaseApp, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

enableIndexedDbPersistence(db);

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

Vue.prototype.$db = () => getFirestore();

const auth = getAuth();

router.beforeEach((to, from, next) => {
  if (to.path !== "/auth") {
    onAuthStateChanged(auth, user => {
      if (!user) {
        next({ path: "/auth" });
      } else {
        next();
      }
    });
  } else if (to.path === "/auth") {
    onAuthStateChanged(auth, user => {
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
