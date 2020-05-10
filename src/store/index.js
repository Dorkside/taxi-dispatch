import Vue from "vue";
import Vuex from "vuex";
import VuexORM from "@vuex-orm/core";
import database from "@/database";
import Course from "@/models/Course";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentDate: new Date(),
    admin: false
  },
  mutations: {
    setDate(state, date) {
      state.currentDate = new Date(date);
      Course.fetch(new Date(date).toISOString().substring(0, 10));
    },
    setAdmin(state, admin) {
      state.admin = admin;
    }
  },
  plugins: [VuexORM.install(database)]
});

export default store;
