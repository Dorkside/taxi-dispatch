import Vue from "vue";
import Vuex from "vuex";
import VuexORM from "@vuex-orm/core";
import database from "@/database";

import { db } from "./db";
import Chauffeur from "../models/Chauffeur";
import Patient from "../models/Patient";
import Course from "../models/Course";

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

db.collection("chauffeurs").onSnapshot(function(querySnapshot) {
  querySnapshot.docChanges().forEach(function(change) {
    if (change.type === "added") {
      Chauffeur.insert({
        data: {
          ...change.doc.data(),
          id: change.doc.id
        }
      });
    }
    if (change.type === "modified") {
      Chauffeur.update({ where: change.doc.id, data: change.doc.data() });
    }
    if (change.type === "removed") {
      Chauffeur.delete(change.doc.id);
    }
  });
});

db.collection("patients").onSnapshot(function(querySnapshot) {
  querySnapshot.docChanges().forEach(function(change) {
    if (change.type === "added") {
      Patient.insert({
        data: {
          ...change.doc.data(),
          id: change.doc.id
        }
      });
    }
    if (change.type === "modified") {
      Patient.update({ where: change.doc.id, data: change.doc.data() });
    }
    if (change.type === "removed") {
      Patient.delete(change.doc.id);
    }
  });
});

db.collection("courses").onSnapshot(function(querySnapshot) {
  querySnapshot.docChanges().forEach(function(change) {
    if (change.type === "added") {
      Course.insert({
        data: {
          ...change.doc.data(),
          id: change.doc.id
        }
      });
    }
    if (change.type === "modified") {
      Course.update({ where: change.doc.id, data: change.doc.data() });
    }
    if (change.type === "removed") {
      Course.delete(change.doc.id);
    }
  });
});

export default store;
