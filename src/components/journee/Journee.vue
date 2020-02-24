<template>
  <div class="pa-0 ma-0 d-flex align-stretch flex-column day-container">
    <v-subheader
      class="d-flex flex-grow-0 flex-shrink-0 elevation-2"
      style="z-index: 10;"
    >
      <v-switch
        v-if="admin"
        v-model="showAll"
        class="flex-shrink-0"
        label="Afficher toutes les courses"
      >
      </v-switch>
      <v-spacer></v-spacer>
      <v-progress-linear
        height="20"
        striped
        rounded
        :value="
          (coursesTodayPlanifiedDone.length * 100) /
            coursesTodayPlanified.length
        "
        class="flex-grow-0 mx-2"
        style="max-width: 400px;"
      >
        <template v-slot="{ value }">
          <strong>
            Courses de la journée : {{ coursesTodayPlanifiedDone.length }} /
            {{ coursesTodayPlanified.length }}
          </strong>
        </template>
      </v-progress-linear>
      <v-spacer></v-spacer>
      <v-btn v-if="admin" small text @click="addCourse()">
        <v-icon>mdi-plus-circle</v-icon> Ajouter course
      </v-btn>
    </v-subheader>
    <div
      ref="coursesList"
      class="d-flex flex-grow-1 flex-shrink-1 flex-column align-stretch pa-2 scroll"
      style="position: relative;"
    >
      <v-list class="flex-grow-1 transparent pa-0" dense>
        <v-subheader v-if="coursesTodayUnplanifiedFiltered.length > 0">
          Courses à planifier
        </v-subheader>

        <template v-if="admin && coursesTodayUnplanifiedFiltered.length > 0">
          <v-list-item
            v-for="(course, index) in coursesTodayUnplanifiedFiltered"
            :key="`${course.ref}-${course.id}`"
            :index="index"
            class="mx-2 pa-0"
          >
            <v-list-item-content
              class="show-overflow justify-center align-center"
            >
              <course-item
                :course="course"
                class="my-1"
                :index="index"
                :hide-chauffeur="true"
              ></course-item>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-divider
          v-if="coursesTodayUnplanifiedFiltered.length > 0 && admin"
        ></v-divider>

        <v-subheader v-if="admin">
          Courses de la journée
          {{ coursesTodayPlanifiedDone.length }}
          / {{ coursesTodayPlanified.length }}
        </v-subheader>

        <v-list-item
          v-for="(course, index) in coursesTodayPlanifiedFiltered"
          :key="`${course.ref}-${course.id}`"
          :index="index"
          class="mx-2 pa-0"
        >
          <v-list-item-content
            class="show-overflow justify-center align-center"
          >
            <course-item
              :key="`${course.ref}-${course.id}`"
              class="my-1"
              :style="{ opacity: course.doneDate ? '0.5' : '1' }"
              :course="course"
              :index="index"
            ></course-item>
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
import uuid from "uuid";
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
      ],
      showAll: false
    };
  },
  created() {
    // this.initTodayCourses();
  },
  mounted() {
    this.scrollToNow();
  },
  computed: {
    ...mapState(["currentDate", "admin"]),
    recurringCourses() {
      if (this.admin) {
        return this.patients
          .filter(patient => {
            return patient[this.currentDay];
          })
          .reduce((result, patient) => {
            result.push(
              new Course({
                ref: `${this.date}.${patient.id}.Aller`,
                date: this.date,
                time: patient[this.currentDay],
                patient: Patient.find(patient.id),
                generated: true,
                societe: patient.societe,
                deleted: "",
                type: patient.type
              })
            );
            result.push(
              new Course({
                ref: `${this.date}.${patient.id}.Retour`,
                date: this.date,
                time: patient[this.currentDay + "Retour"],
                patient: Patient.find(patient.id),
                generated: true,
                societe: patient.societe,
                deleted: "",
                type: patient.type
              })
            );
            return result;
          }, [])
          .filter(
            _course =>
              !this.courses.map(course => course.ref).includes(_course.ref)
          );
      }
      return [];
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
    allCourses() {
      return this.courses.concat(this.recurringCourses);
    },
    coursesToday() {
      if (this.currentDate) {
        return this.allCourses.filter(course => course.date === this.date);
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
    coursesTodayPlanifiedDone() {
      return this.coursesTodayPlanified.filter(
        course => !!course.doneDate && !course.deleted
      );
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
    coursesTodayUnplanifiedFiltered() {
      return this.coursesTodayUnplanified.filter(
        course => (!course.doneDate && !course.deleted) || this.showAll
      );
    },
    coursesTodayPlanifiedFiltered() {
      return this.coursesTodayPlanified.filter(
        course => (!course.doneDate && !course.deleted) || this.showAll
      );
    },
    currentDay() {
      return this.days[new Date(this.currentDate).getDay()].toLowerCase();
    }
  },
  methods: {
    addCourse() {
      Course.create({
        date: this.date,
        deleted: "",
        ref: `${this.date}.${uuid.v4()}`
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
