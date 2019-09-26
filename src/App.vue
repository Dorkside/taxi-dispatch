<template>
  <v-app>
    <v-container fluid fill-height class="d-flex flex-column pa-0">
      <v-container
        fluid
        class="d-flex elevation-8 pa-0 z-index-10 align-center"
      >
        <v-tabs background-color="blue accent-4" dark class="flex-grow-1">
          <v-tab to="/cal/journee">
            <v-icon left>mdi-view-sequential</v-icon>
            Journée
          </v-tab>
          <v-tab to="/cal/departs">
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
        <v-btn
          absolute
          bottom
          dark
          right
          fab
          color="red accent-4"
          @click="logOut"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
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
  methods: {
    logOut() {
      firebase.auth().signOut();
    }
  }
};
</script>

<style>
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
