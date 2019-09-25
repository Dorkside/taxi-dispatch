<template>
  <v-app>
    <v-content>
      <v-flex class="d-flex elevation-8 z-index-10 align-center">
        <v-tabs background-color="blue accent-4" dark class="flex-grow-1">
          <v-tab to="/cal/journee">
            <v-icon left>mdi-view-day</v-icon>
            Journée
          </v-tab>
          <v-tab to="/series">
            <v-icon left>mdi-calendar-week</v-icon>
            Séries
          </v-tab>
          <v-tab to="/annuaire">
            <v-icon left>mdi-medical-bag</v-icon>
            Annuaire
          </v-tab>
        </v-tabs>
        <v-btn
          absolute
          bottom
          dark
          right
          fab
          @click="logOut"
          color="red accent-4"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-flex>
      <v-flex shrink fill-height class="max-height">
        <router-view></router-view>
      </v-flex>
    </v-content>
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
