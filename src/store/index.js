import Vue from "vue";
import Vuex from "vuex";
import VuexORM from "@vuex-orm/core";
import database from "@/database";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentDate: new Date(),
    admin: false
  },
  mutations: {
    setDate(state, date) {
      if (
        state.currentDate.toISOString().substring(0, 10) !==
        new Date(date).toISOString().substring(0, 10)
      ) {
        state.currentDate = new Date(date);
      }
    },
    setAdmin(state, admin) {
      state.admin = admin;
    }
  },
  plugins: [VuexORM.install(database)]
});

export default store;
