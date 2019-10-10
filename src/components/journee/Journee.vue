<template>
  <v-container class="pa-0 ma-0 d-flex" fluid fill-height>
    <v-container
      class="d-flex flex-shrink-0 flex-grow-0 unplanned scroll align-stretch pa-0"
      fluid
      fill-height
    >
      <v-list class="flex-grow-1 transparent pa-0" dense>
        <v-subheader class="title-scroll">
          <v-chip class=" overline">Courses non planifiées</v-chip>
        </v-subheader>
        <v-list-item
          v-for="(course, index) in coursesTodayUnplanified"
          :key="`${course.ref}-${course.id}`"
          :index="index"
          class="ma-2"
        >
          <v-list-item-content class="show-overflow">
            <course-item
              :course="course"
              :index="index"
              hide-chauffeur="true"
            ></course-item>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
    <v-container
      class="d-flex flex-grow-1 align-start pa-0 scroll"
      fluid
      fill-height
    >
      <v-timeline class="flex-grow-1 pa-1" dense>
        <v-chip class="title-scroll overline timeline-sticky">
          Courses de la journée
        </v-chip>
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
                  : course.direction === "Retour"
                  ? "mdi-arrow-left"
                  : ""
              }}
            </v-icon>
          </template>
          <course-item :course="course" :index="index"></course-item>
        </v-timeline-item>
      </v-timeline>
    </v-container>
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
  components: {
    draggable,
    CourseItem
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
.unplanned {
  width: 400px;
}
.ghost {
  opacity: 0.5;
}
.show-overflow {
  overflow: visible;
}
.scroll {
  overflow-y: auto;
}
.timeline-sticky {
  top: 4px !important;
}
</style>
