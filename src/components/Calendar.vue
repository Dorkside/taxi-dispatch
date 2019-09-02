<template>
  <v-layout fill-height>
    <v-flex xs3 class="elevation-8 z-index-10">
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
    <v-flex max-height-vh>
      <v-layout column fill-height>
        <v-flex>
          <v-tabs background-color="blue accent-4" dark>
            <v-tab to="journee">
              <v-icon left>mdi-view-day</v-icon>
              Journée
            </v-tab>
            <v-tab to="patients">
              <v-icon left>mdi-calendar-week</v-icon>
              Patients
            </v-tab>

            <v-tab to="chauffeurs">
              <v-icon left>mdi-calendar-week</v-icon>
              Chauffeurs
            </v-tab>
          </v-tabs>
        </v-flex>
        <v-flex shrink fill-height class="max-height">
          <router-view></router-view>
        </v-flex>
      </v-layout>
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
    async addCourse() {
      try {
        let course = await Course.insert({
          data: {
            date: this.date
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    addChauffeur() {
      Chauffeur.$create({
        data: {}
      });
    },
    addPatient() {
      let patient = new Patient();
      patient.$save();
    }
  }
};
</script>

<style lang="scss">
.max-height-vh {
  max-height: 100vh;
}
.max-height {
  max-height: 100%;
  overflow-y: hidden;
}
.debug {
  border: solid 5px red;
}
</style>
