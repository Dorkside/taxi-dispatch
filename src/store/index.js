import Vue from "vue";
import Vuex from "vuex";
import VuexORM from "@vuex-orm/core";
import VuexORMAxios from "@vuex-orm/plugin-axios";
import database from "@/database";

VuexORM.use(VuexORMAxios, {
  database,
  http: {
    baseUrl: "",
    url: "/",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }
});

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentDate: new Date()
  },
  mutations: {
    setDate(state, date) {
      state.currentDate = date;
    }
  },
  plugins: [VuexORM.install(database)]
});

export default store;
