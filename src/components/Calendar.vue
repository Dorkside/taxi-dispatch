<template>
  <div class="d-flex flex-row pa-0">
    <v-list
      class="flex-grow-0 flex-shrink-0 elevation-6 z-index-9"
      width="300px"
    >
      <v-list-item>
        <v-date-picker
          full-width
          locale="fr"
          :value="date"
          @input="setDate"
        ></v-date-picker>
      </v-list-item>
      <v-list-item v-if="admin">
        <v-btn block @click="addCourse()">
          <v-icon>mdi-plus-circle</v-icon> Ajouter course
        </v-btn>
      </v-list-item>
    </v-list>
    <div fluid class="flex-grow-1 flex-shrink-1 pa-0 scroll">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Course from "@/models/Course";
export default {
  name: "Calendar",
  computed: {
    ...mapState(["currentDate", "admin"]),
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
  overflow-y: scroll;
}
</style>
