<template>
  <v-app>
    <v-navigation-drawer app>
      <v-date-picker full-width v-model="picker"></v-date-picker>
    </v-navigation-drawer>

    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import store from "@/store";
import data from "@/data";
import Course from "@/models/Course";
import Journee from "./journee/Journee.vue";

export default {
  store,
  data() {
    return {
      picker: new Date().toISOString().substr(0, 10)
    };
  },

  components: {
    Journee
  },

  created() {
    const initialData = data;
    Course.insert({ data: initialData });
  }
};
</script>

<style scoped>
</style>
