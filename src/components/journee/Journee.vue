<template>
  <v-container>
    <v-row>
      <v-col>
        <v-timeline dense>
          <course-timeline-item
            v-for="(course, index) in coursesTodayPlanified"
            :key="`${course.ref}-${course.id}`"
            :course="course"
            :index="index"
          ></course-timeline-item>
        </v-timeline>
      </v-col>
      <v-col>
        <v-list dense>
          <v-list-item
            v-for="(course, index) in coursesTodayUnplanified"
            :key="`${course.ref}-${course.id}`"
            :index="index"
          >
            {{ course.patient.name }}
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
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
  components: {
    CourseTimelineItem
  },
  created() {
    this.initTodayCourses();
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
        return this.courses.filter(course => course.date === this.date);
      }
      return [];
    },
    coursesTodayPlanified() {
      return this.coursesToday.filter(course => course.time !== "");
    },
    coursesTodayUnplanified() {
      return this.coursesToday.filter(course => course.time === "");
    },
    currentDay() {
      return this.days[new Date(this.currentDate).getDay()].toLowerCase();
    }
  },
  methods: {
    initTodayCourses() {
      let _courses = this.patients
        .filter(patient => {
          return patient[this.currentDay];
        })
        .reduce((result, patient) => {
          result.push({
            ref: `${this.date}.${patient.id}.Aller`,
            date: this.date,
            time: patient[this.currentDay],
            patient_id: patient.id,
            generated: true
          });
          result.push({
            ref: `${this.date}.${patient.id}.Retour`,
            date: this.date,
            patient_id: patient.id,
            generated: true
          });
          return result;
        }, []);
      Course.insert({
        data: _courses.filter(
          _course =>
            !this.courses.map(course => course.ref).includes(_course.ref)
        )
      });
    }
  },
  watch: {
    currentDate() {
      console.log(this.currentDate);
      this.initTodayCourses();
    }
  }
};
</script>

<style scoped lang="scss">
</style>
