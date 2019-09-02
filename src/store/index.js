import Vue from "vue";
import Vuex from "vuex";
import VuexORM from "@vuex-orm/core";
import VuexORMAxios from "@vuex-orm/plugin-axios";
import database from "@/database";
import * as FireStoreParser from "firestore-parser";

VuexORM.use(VuexORMAxios, {
  database,
  http: {
    baseURL:
      "https://firestore.googleapis.com/v1/projects/taxi-oka/databases/(default)/documents/",
    url: "/",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    onResponse(response) {
      let { data } = response;
      if (data.documents) {
        const result = FireStoreParser(data.documents).map(document => ({
          id: document.name.split("/").pop(),
          ...document.fields
        }));
        return result;
      } else {
        const document = FireStoreParser(data);
        return {
          id: document.name.split("/").pop(),
          ...document.fields
        };
      }
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
