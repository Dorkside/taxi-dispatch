<template>
  <v-container class="d-flex align-stretch pa-0" fluid fill-height>
    <v-list
      width="200px"
      class="flex-shrink-0 elevation-8"
      :style="{ 'z-index': 1 }"
    >
      <draggable
        :value="coursesTodayUnplanified"
        :sort="true"
        group="courses"
        fill-height
        :style="{ height: '100%' }"
        @change="moveCourse($event, null)"
      >
        <v-list-item
          v-for="(course, index) in coursesTodayUnplanified"
          :key="`${course.ref}-${course.id}`"
        >
          <depart-item :course="course" :index="index"></depart-item>
        </v-list-item>
      </draggable>
    </v-list>
    <v-container
      class="d-flex flex-grow-1 align-stretch pa-0"
      fluid
      fill-height
    >
      <template v-for="chauffeur of chauffeurs">
        <v-card
          :key="chauffeur.id"
          flat
          class="chauffeur pa-0"
          :style="{ position: 'relative' }"
        >
          <v-chip class="subtitle-1 ml-4 mt-4">{{ chauffeur.name }}</v-chip>

          <v-timeline dense :style="{ height: '100%' }">
            <draggable
              :value="chauffeur.courses"
              :sort="true"
              group="courses"
              fill-height
              :style="{ height: '100%' }"
              @change="moveCourse($event, chauffeur)"
            >
              <v-timeline-item
                v-for="(course, index) in chauffeur.courses"
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
            </draggable>
          </v-timeline>
        </v-card>
      </template>
    </v-container>
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
        .with("courses", query => {
          query.where("date", this.date);
        })
        .with("courses.patient")
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
    coursesToday() {
      if (this.currentDate) {
        return this.courses.filter(course => course.date === this.date);
      }
      return [];
    },
    coursesTodayUnplanified() {
      return this.coursesToday
        .filter(course => course.time !== "")
        .filter(course => !course.chauffeur_id)
        .sort((a, b) => {
          if (a.priority === "") return 0;
          if (b.priority === "") return 0;
          if (a.priority < b.priority) return -1;
          return 1;
        });
    },
    patients() {
      return Patient.query().get();
    },
    currentDay() {
      return this.days[new Date(this.currentDate).getDay()].toLowerCase();
    }
  },
  methods: {
    moveCourse(event, chauffeur) {
      if (event.added) {
        event.added.element.update({ chauffeur_id: chauffeur.id });
      }
    },
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
  min-width: 250px;
}
</style>
