<template>
  <v-container class="d-flex align-stretch pa-0" fluid fill-height>
    <template v-for="chauffeur of chauffeurs">
      <v-card :key="chauffeur.id" outlined tile flat class="chauffeur">
        <v-card-title>
          {{ chauffeur.name }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-timeline dense>
            <v-timeline-item
              v-for="(course, index) in coursesTodayPlanified"
              :key="`${course.ref}-${course.id}`"
              :color="course.color"
              class="pr-2"
              small
              fill-dot
            >
              <template v-slot:icon dark>
                <v-icon dark>
                  {{
                    course.direction === "Aller"
                      ? "mdi-arrow-right"
                      : "mdi-arrow-left"
                  }}
                </v-icon>
              </template>
              <depart-item :course="course" :index="index"></depart-item>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";

import Course from "@/models/Course";
import Chauffeur from "@/models/Chauffeur";
import Patient from "@/models/Patient";
import DepartItem from "./DepartItem";
import { mapState } from "vuex";
export default {
  name: "Departs",
  components: {
    draggable,
    DepartItem
  },
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
  created() {
    this.initTodayCourses();
  },
  computed: {
    ...mapState(["currentDate"]),
    chauffeurs() {
      return Chauffeur.query()
        .with("courses")
        .orderBy("name", "asc")
        .get();
    },
    date() {
      return this.currentDate.toISOString().substring(0, 10);
    },
    courses() {
      return Course.query()
        .with("chauffeur")
        .with("patient")
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
      return this.coursesToday
        .filter(course => course.time !== "")
        .sort((a, b) => {
          if (a.time === "") return 0;
          if (b.time === "") return 0;
          if (a.time < b.time) return -1;
          return 1;
        });
    },
    coursesTodayUnplanified: {
      get() {
        return this.coursesToday
          .filter(course => course.time === "")
          .sort((a, b) => {
            if (a.priority === "") return 0;
            if (b.priority === "") return 0;
            if (a.priority < b.priority) return -1;
            return 1;
          });
      },
      set(value) {
        console.log("updateunplanified", value);
        Course.update({
          data: value.map((course, index) => {
            course.priority = index;
            return course;
          })
        });
      }
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
            generated: true,
            deleted: ""
          });
          result.push({
            ref: `${this.date}.${patient.id}.Retour`,
            date: this.date,
            time: patient[this.currentDay + "Retour"],
            patient_id: patient.id,
            generated: true,
            deleted: ""
          });
          return result;
        }, []);
      _courses
        .filter(
          _course =>
            !this.courses.map(course => course.ref).includes(_course.ref)
        )
        .forEach(course => {
          Course.create(course);
        });
    }
  },
  watch: {
    currentDate() {
      if (this.courses ? this.courses.length : false) {
        this.initTodayCourses();
      }
    },
    patients() {
      if (this.courses ? this.courses.length : false) {
        this.initTodayCourses();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.chauffeur {
  min-width: 300px;
}
</style>
