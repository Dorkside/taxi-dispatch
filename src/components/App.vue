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
import Course from "@/models/Course";
import Journee from "./journee/Journee.vue";

export default {
  store,

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
