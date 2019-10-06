<template>
  <v-app fill-height class="fill-screen">
    <v-app-bar color="blue accent-4">
      <v-toolbar-title class="title white--text text-center toolbar-title">
        <v-btn text absolute outlined small dark left to="/cal/journee">
          Taxi OKA
        </v-btn>
        <span>{{ prettyDate }}</span>
        <v-btn text absolute outlined small dark right @click="logOut">
          <v-icon left>mdi-close</v-icon>
          Déconnexion
        </v-btn>
      </v-toolbar-title>
    </v-app-bar>
    <v-container fluid fill-height class="d-flex flex-column pa-0">
      <v-container
        fluid
        class="d-flex elevation-8 pa-0 z-index-10 align-center"
      >
        <v-tabs background-color="blue accent-3" dark class="flex-grow-1">
          <v-tab to="/cal/journee">
            <v-icon left>mdi-view-sequential</v-icon>
            Journée
          </v-tab>
          <v-tab to="/departs">
            <v-icon left>mdi-view-parallel</v-icon>
            Départs
          </v-tab>
          <v-tab to="/series">
            <v-icon left>mdi-calendar-week</v-icon>
            Séries
          </v-tab>
          <v-tab to="/annuaire">
            <v-icon left>mdi-contacts</v-icon>
            Annuaire
          </v-tab>
        </v-tabs>
      </v-container>
      <v-container fluid fill-height class="flex-grow-1 pa-0">
        <router-view></router-view>
      </v-container>
    </v-container>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import firebase from "firebase";
import store from "@/store";
import Patient from "./models/Patient";

import { data } from "./models/contacts.json";

export default {
  store,
  computed: {
    ...mapState(["currentDate"]),
    prettyDate() {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      return new Date(this.currentDate).toLocaleDateString("fr-FR", options);
    },
    patients() {
      return Patient.query().get();
    }
  },
  mounted() {},
  methods: {
    logOut() {
      firebase.auth().signOut();
    },
    initContacts() {
      const types = ["dyal", "cs", "psy", "ipc", "kine"];
      const contacts = data
        .filter(contact => {
          const c = contact.split(" ");
          return (
            c.some(part => types.some(type => part.toLowerCase() === type)) &&
            !types.includes(c[0].toLowerCase())
          );
        })
        .map(contact => {
          let type = "Consultation";
          const parts = contact.split(" ");
          if (parts.some(part => part.toLowerCase() === "dyal")) {
            type = "Dialyse";
          }
          if (parts.some(part => part.toLowerCase() === "psy")) {
            type = "HDJ";
          }
          if (parts.some(part => part.toLowerCase() === "kine")) {
            type = "Kiné / Rééducation";
          }
          return {
            name: contact,
            type
          };
        });

      setTimeout(() => {
        console.log(this.patients);
        contacts.forEach(contact => {
          if (!this.patients.some(patient => patient.name === contact.name)) {
            console.log(`Creating ${contact}`);
            Patient.create(contact);
          }
        });
      }, 5000);
    }
  }
};
</script>

<style>
.fill-screen {
  height: 100vh;
}
.toolbar-title {
  width: 100%;
}
.title-scroll {
  position: sticky !important;
  top: 0;
  z-index: 11 !important;
}
.z-index-10 {
  position: relative;
  z-index: 10;
}
.z-index-9 {
  position: relative;
  z-index: 9;
}
.z-index-8 {
  position: relative;
  z-index: 8;
}
.z-index-7 {
  position: relative;
  z-index: 7;
}
.z-index-6 {
  position: relative;
  z-index: 6;
}
</style>
