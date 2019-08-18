<template>
  <v-container class="pa-0" fill-height>
    <v-row class="ma-0 max-height max-width">
      <v-col class="pa-0 pr-2 max-height scroll">
        <v-timeline dense>
          <v-timeline-item
            v-for="(course, index) in coursesTodayPlanified"
            :key="`${course.ref}-${course.id}`"
            :color="course.color"
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
            <course-item :course="course" :index="index"></course-item>
          </v-timeline-item>
        </v-timeline>
      </v-col>
      <v-col class="pa-0 pr-2 max-height scroll">
        <v-list dense>
          <draggable
            v-model="coursesTodayUnplanified"
            group="courses"
            ghost-class="ghost"
            @start="drag = true"
            @end="drag = false"
          >
            <transition-group>
              <v-list-item
                v-for="(course, index) in coursesTodayUnplanified"
                :key="`${course.ref}-${course.id}`"
                :index="index"
                class="ma-2"
              >
                <v-list-item-content class="show-overflow">
                  <course-item :course="course" :index="index"></course-item>
                </v-list-item-content>
              </v-list-item>
            </transition-group>
          </draggable>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";

import Course from "@/models/Course";
import Patient from "@/models/Patient";
import CourseItem from "./CourseItem";
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
    draggable,
    CourseItem
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
.ghost {
  opacity: 0.5;
}
.show-overflow {
  overflow: visible;
}
.max-width {
  max-width: 100%;
}
.max-height {
  height: 100%;
  max-height: 100%;
  &.scroll {
    overflow-y: auto;
  }
}
</style>
