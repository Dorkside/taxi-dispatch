<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import store from "@/store";
import data from "@/data";
import Patient from "@/models/Patient";
import Chauffeur from "@/models/Chauffeur";
import Course from "@/models/Course";
import Journee from "./journee/Journee.vue";

export default {
  store,

  components: {
    Journee
  },

  created() {
    const initialData = data;
    Patient.insert({ data: initialData.patients });
    Chauffeur.insert({ data: initialData.chauffeurs });
  }
};
</script>

<style>
.z-index-10 {
  z-index: 10;
}
</style>
