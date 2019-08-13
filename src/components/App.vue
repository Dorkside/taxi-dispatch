<template>
  <v-app>
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item to="/cal/journee">
          <v-list-item-icon>
            <v-icon>mdi-view-day</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Journée</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/patients">
          <v-list-item-icon>
            <v-icon>mdi-calendar-week</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Patients</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
