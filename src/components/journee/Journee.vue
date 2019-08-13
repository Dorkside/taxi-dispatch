<template>
  <v-timeline dense>
    <course-timeline-item
      v-for="(course, index) in coursesToday"
      :key="index"
      :course="course"
      :index="index"
    ></course-timeline-item>
  </v-timeline>
</template>

<script>
import Course from "@/models/Course";
import Patient from "@/models/Patient";
import CourseTimelineItem from "./CourseTimelineItem";
import { mapState } from "vuex";
export default {
  name: "Journee",
  data() {
    return {
      days: [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi"
      ]
    };
  },
  mounted() {
    console.log(this.autoCourses);
  },
  components: {
    CourseTimelineItem
  },
  computed: {
    ...mapState(["currentDate"]),
    date() {
      return this.currentDate.toISOString().substring(0, 10);
    },
    courses() {
      return Course.query()
        .with("chauffeur")
        .with("patient")
        .orderBy("time", "asc")
        .get();
    },
    patients() {
      return Patient.query().get();
    },
    coursesToday() {
      if (this.currentDate) {
        return this.courses
          .filter(course => course.date === this.date)
          .concat(this.autoCourses);
      }
    },
    autoCourses() {
      let day = new Date(this.currentDate).getDay();
      return this.patients
        .filter(patient => {
          return patient[this.currentDay];
        })
        .map(patient => {
          return new Course({
            date: this.date,
            time: patient[this.currentDay],
            patient: patient
          });
        });
    },
    currentDay() {
      return this.days[new Date(this.currentDate).getDay()].toLowerCase();
    }
  }
};
</script>

<style scoped lang="scss">
</style>
