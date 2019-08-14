<template>
  <v-layout>
    <v-flex xs3>
      <v-list>
        <v-list-item>
          <v-date-picker
            full-width
            :value="date"
            @input="setDate"
          ></v-date-picker>
        </v-list-item>
        <v-list-item>
          <v-btn block @click="addCourse()">
            Ajouter course
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block @click="addChauffeur()">
            Ajouter chauffeur
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block @click="addPatient()">
            Ajouter patient
          </v-btn>
        </v-list-item>
      </v-list>
    </v-flex>
    <v-flex>
      <v-tabs fixed-tabs>
        <v-tab to="journee">
          <v-icon left>mdi-view-day</v-icon>
          Journée
        </v-tab>
        <v-tab to="patients">
          <v-icon left>mdi-calendar-week</v-icon>
          Patients
        </v-tab>
      </v-tabs>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import Course from "@/models/Course";
import Patient from "@/models/Patient";
import Chauffeur from "@/models/Chauffeur";
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
    },
    addChauffeur() {
      let chauffeur = new Chauffeur();
      chauffeur.$save();
    },
    addPatient() {
      let patient = new Patient();
      patient.$save();
    }
  }
};
</script>