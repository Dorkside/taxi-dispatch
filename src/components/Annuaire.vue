<template>
  <v-layout fill-height>
    <v-flex xs3 class="elevation-6 z-index-9">
      <v-tabs vertical class="transparent w100">
        <v-tab to="patients">
          <v-icon left>mdi-medical-bag</v-icon>
          Patients
        </v-tab>
        <v-tab to="chauffeurs">
          <v-icon left>mdi-car</v-icon>
          Chauffeurs
        </v-tab>
      </v-tabs>
    </v-flex>
    <v-flex>
      <v-layout column fill-height> <router-view></router-view> </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "Annuaire"
};
</script>

<style lang="scss">
.w100 {
  .v-item-group {
    width: 100%;
    .v-tab {
      margin-left: 0 !important;
    }
  }
}
.transparent {
  .v-tabs-bar,
  .v-item-group {
    background-color: transparent !important;
  }
}
</style>
