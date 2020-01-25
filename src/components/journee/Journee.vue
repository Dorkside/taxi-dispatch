<template>
  <div class="pa-0 ma-0 d-flex align-stretch day-container">
    <div
      v-if="admin"
      class="flex-shrink-0 flex-grow-0 unplanned align-stretch pa-1 scroll elevation-8"
    >
      <v-list class="d-flex flex-column flex-grow-1 transparent pa-0" dense>
        <v-subheader class="flex-grow-0 flex-shrink-0">
          <v-chip class=" overline">Courses non planifiées</v-chip>

          <v-btn small text @click="addCourse()">
            <v-icon>mdi-plus-circle</v-icon> Ajouter course
          </v-btn>
        </v-subheader>
        <v-list-item
          v-for="(course, index) in coursesTodayUnplanified"
          :key="`${course.ref}-${course.id}`"
          :index="index"
          class="mx-2 flex-grow-1 flex-shrink-1"
        >
          <v-list-item-content class="show-overflow">
            <course-item
              :course="course"
              :index="index"
              :hide-chauffeur="true"
            ></course-item>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
    <div
      ref="coursesList"
      class="d-flex flex-grow-1 flex-shrink-1 flex-column align-stretch pa-2 scroll"
    >
      <v-list class="flex-grow-1 transparent pa-0" dense>
        <v-list-item
          v-for="(course, index) in coursesTodayPlanified"
          :key="`${course.ref}-${course.id}`"
          :index="index"
          class="mx-2 pa-0"
        >
          <v-list-item-content class="show-overflow">
            <div :ref="`${course.ref}-${course.id}`">
              <course-item
                :key="`${course.ref}-${course.id}`"
                class="my-1"
                :course="course"
                :index="index"
              ></course-item>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script>
import Course from "@/models/Course";
import Patient from "@/models/Patient";
import CourseItem from "./CourseItem";
import { mapState } from "vuex";
import * as dayjs from "dayjs";
export default {
  name: "Journee",
  components: {
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
  mounted() {
    this.scrollToNow();
  },
  computed: {
    ...mapState(["currentDate", "admin"]),
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
    addCourse() {
      Course.create({
        date: this.date,
        deleted: ""
      });
    },
    async scrollToNow() {
      let coursesAfter = this.coursesTodayPlanified.filter(course => {
        return dayjs(`${course.date} ${course.time}`).isAfter();
      });
      if (coursesAfter.length > 0) {
        await this.$nextTick();
        let ref = `${coursesAfter[0].ref}-${coursesAfter[0].id}`;
        if (this.$refs[ref]) {
          this.$refs[ref][0].scrollIntoView(true);
        }
      }
    },
    initTodayCourses() {
      if (this.admin) {
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
    }
  },
  watch: {
    currentDate() {
      if (this.courses ? this.courses.length : false) {
        this.initTodayCourses();
      }
      this.scrollToNow();
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
.day-container {
  height: 100%;
}
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
  overflow-y: scroll;
}
.timeline-sticky {
  top: 4px !important;
}
</style>
