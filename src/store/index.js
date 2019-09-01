import Vue from "vue";
import Vuex from "vuex";
import VuexORM from "@vuex-orm/core";
import database from "@/database";

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
