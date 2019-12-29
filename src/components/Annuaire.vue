<template>
  <v-container class="d-flex flex-row pa-0 align-stretch" fluid fill-height>
    <v-tabs
      vertical
      class="tabs w100 transparent flex-shrink-1 elevation-6 z-index-9"
    >
      <v-tab to="patients" block>
        <v-icon left>mdi-medical-bag</v-icon>
        Patients
      </v-tab>
      <v-tab to="chauffeurs">
        <v-icon left>mdi-car</v-icon>
        Chauffeurs
      </v-tab>
    </v-tabs>
    <v-container
      class="flex-grow-1 flex-shrink-1 pa-0 align-start scroll"
      :style="{ maxHeight: 'calc(100% - 48px)' }"
      fluid
      fill-height
    >
      <router-view></router-view>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "Annuaire"
};
</script>

<style lang="scss" scoped>
.tabs {
  max-width: 150px !important;
}
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
.scroll {
  overflow-y: auto;
}
</style>
