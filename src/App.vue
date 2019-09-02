<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import store from "@/store";
import Chauffeur from "./models/Chauffeur";

export default {
  store,
  mounted() {
    Chauffeur.$fetch();
  }
};
</script>

<style>
.z-index-10 {
  z-index: 10;
}
</style>
