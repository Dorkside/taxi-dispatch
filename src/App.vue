<template>
  <v-app fill-height class="fill-screen">
    <v-app-bar color="blue accent-4">
      <v-toolbar-title class="title white--text text-center toolbar-title">
        <v-btn text absolute outlined small dark left to="/cal/journee">
          Taxi OKA
        </v-btn>
        <span></span>
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
import firebase from "firebase";
import store from "@/store";

export default {
  store,
  computed: {},
  methods: {
    logOut() {
      firebase.auth().signOut();
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
