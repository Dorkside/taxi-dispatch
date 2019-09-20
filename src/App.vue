<template>
  <v-app>
    <v-content>
      <v-flex class="elevation-8 z-index-10">
        <v-tabs background-color="blue accent-4" dark>
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
      </v-flex>
      <v-flex shrink fill-height class="max-height">
        <router-view></router-view>
      </v-flex>
    </v-content>
  </v-app>
</template>

<script>
import store from "@/store";

export default {
  store
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
