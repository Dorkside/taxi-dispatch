<template>
  <v-layout>
    <v-flex xs3>
      <v-date-picker full-width :value="date" @input="setDate"></v-date-picker>
      <v-btn @click="addCourse()">
        Ajouter course
      </v-btn>
    </v-flex>
    <v-flex>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-flex>
  </v-layout>
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
      let course = new Course();
      course.date = this.date;
      course.$save();
    }
  }
};
</script>