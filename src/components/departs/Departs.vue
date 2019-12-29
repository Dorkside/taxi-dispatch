<template>
  <v-container
    class="d-flex align-stretch pa-0 overflow-hide"
    fluid
    fill-height
    :style="{ position: 'relative' }"
  >
    <v-list
      width="250px"
      class="flex-shrink-0 elevation-8 scroll"
      :style="{ 'z-index': 1 }"
      fill-height
    >
      <v-subheader class="title-scroll">
        <v-chip class="overline">Courses non attribuées</v-chip>
      </v-subheader>
      <draggable
        :value="coursesTodayUnplanified"
        :sort="true"
        group="courses"
        fill-height
        @change="moveCourse($event, null)"
      >
        <v-list-item
          v-for="(course, index) in coursesTodayUnplanified"
          :key="`${course.ref}-${course.id}`"
          class="mb-1"
        >
          <depart-item :course="course" :index="index"></depart-item>
        </v-list-item>
      </draggable>
    </v-list>
    <v-container
      class="d-flex flex-grow-1 align-stretch flex-wrap pa-0 overflow-scroll"
      fluid
      fill-height
    >
      <template v-for="chauffeur of chauffeurs">
        <v-card
          :key="chauffeur.id"
          flat
          class="chauffeur pa-0 flex-shrink-1 flex-grow-1"
        >
          <v-container
            fluid
            fill-height
            class="px-2 d-flex flex-column align-stretch scroll"
          >
            <v-chip class="subtitle-1 mt-4 flex-shrink-0 title-scroll">
              {{ chauffeur.name }}
            </v-chip>

            <draggable
              :value="chauffeur.courses"
              :sort="true"
              group="courses"
              :style="{ height: '100%' }"
              @change="moveCourse($event, chauffeur)"
            >
              <depart-item
                v-for="(course, index) in chauffeur.courses"
                :key="`${course.ref}-${course.id}`"
                :course="course"
                class="my-1"
                :index="index"
              ></depart-item>
            </draggable>
          </v-container>
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
          query.where("date", this.date).orderBy("time", "asc");
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
        return this.courses
          .filter(course => !course.deleted)
          .filter(course => course.date === this.date);
      }
      return [];
    },
    coursesTodayUnplanified() {
      return this.coursesToday
        .filter(course => course.time !== "")
        .filter(course => !course.chauffeur_id)
        .sort((a, b) => {
          if (a.time < b.time) return -1;
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
.full-width {
  width: 100%;
  max-width: 100%;
}
.overflow-hide {
  overflow: hidden;
}
.chauffeur {
  min-height: 40vh;
  max-height: 40vh;
  width: 20%;
  min-width: 16%;
  max-width: 20%;
  flex: 0 0 20%;
}
.scroll {
  overflow-y: auto;
}
.overflow-scroll {
  overflow: auto;
}
</style>
