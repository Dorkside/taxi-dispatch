<template>
  <v-container fluid fill-height class="d-flex max-vw align-stretch pa-0">
    <v-list class="flex-shrink-0 elevation-6 z-index-9" width="300px">
      <v-list-item>
        <v-date-picker
          full-width
          locale="fr"
          :value="date"
          @input="setDate"
        ></v-date-picker>
      </v-list-item>
      <v-list-item>
        <v-btn block @click="addCourse()">
          <v-icon>mdi-plus-circle</v-icon> Ajouter course
        </v-btn>
      </v-list-item>
    </v-list>
    <v-container
      fluid
      fill-height
      class="flex-grow-1 flex-shrink-1 pa-0 scroll"
    >
      <router-view></router-view>
    </v-container>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import Course from "@/models/Course";
export default {
  name: "Calendar",
  computed: {
    ...mapState(["currentDate"]),
    date() {
      return this.currentDate.toISOString().substring(0, 10);
    }
  },
  methods: {
    setDate(event) {
      this.$store.commit("setDate", new Date(event));
    },
    addCourse() {
      Course.create({
        date: this.date,
        deleted: ""
      });
    }
  }
};
</script>

<style lang="scss">
.scroll {
  overflow-y: auto;
}
</style>
