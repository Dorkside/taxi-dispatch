<template>
  <div
    class="d-flex align-stretch pa-0 overflow-hidden"
    :style="{ position: 'relative', height: '100%' }"
  >
    <v-list
      width="300px"
      class="d-flex flex-column flex-shrink-0 elevation-8 scroll pa-0"
    >
      <v-subheader
        class="title-scroll flex-grow-0 flex-shrink-0"
        style="top: 0;"
      >
        <v-chip
          class="overline elevation-2"
          style="position: absolute; top: 0; left: 0; border-radius: 0 0 12px 0;"
          >Courses non attribuées</v-chip
        >
      </v-subheader>
      <div class="flex-grow-1 flex-shrink-1">
        <draggable
          :value="coursesTodayUnplanified"
          handle=".handle"
          :sort="true"
          group="courses"
          fill-height
          class="mx-2 "
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
      </div>
    </v-list>
    <draggable
      v-model="chauffeurs"
      handle=".handle-chauffeur"
      :sort="true"
      group="chauffeurs"
      class="d-flex flex-grow-1 align-stretch flex-wrap pa-4 scroll"
    >
      <v-card
        v-for="chauffeur of chauffeurs"
        :key="chauffeur.id"
        flat
        class="ma-2 chauffeur pa-0 flex-shrink-1 flex-grow-1 elevation-2"
      >
        <v-subheader class="title-scroll" style="top: -16px;">
          <v-chip
            style="position:absolute; top: 0; left: 0; border-radius: 4px 0 12px 0;"
          >
            {{ chauffeur.name }}
          </v-chip>
        </v-subheader>
        <v-icon class="handle-chauffeur">
          {{ "mdi-arrow-all" }}
        </v-icon>
        <v-list
          class="pa-0 d-flex flex-column align-stretch overflow-y-auto"
          :style="{ height: 'calc(100% - 48px)', background: 'transparent' }"
        >
          <draggable
            :value="chauffeur.courses"
            :sort="true"
            handle=".handle"
            group="courses"
            :style="{ height: '100%' }"
            @change="moveCourse($event, chauffeur)"
          >
            <depart-item
              v-for="(course, index) in chauffeur.courses"
              :key="`${course.ref}-${course.id}`"
              :course="course"
              class="my-1 px-2"
              :index="index"
            ></depart-item>
          </draggable>
        </v-list>
      </v-card>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";

import Course from "@/models/Course";
import Chauffeur from "@/models/Chauffeur";
import Patient from "@/models/Patient";
import DepartItem from "./DepartItem";
import { mapState } from "vuex";

import firebase from "firebase/compat/app";

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
        "Samedi",
        "Dimanche"
      ]
    };
  },
  computed: {
    ...mapState(["currentDate", "admin"]),
    recurringCourses() {
      if (this.admin) {
        return this.patients
          .filter(patient => !patient.deleted)
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
                deleted: "",
                doneDate: "",
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
                deleted: "",
                doneDate: "",
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
    chauffeurs: {
      get() {
        return Chauffeur.query()
          .where("deleted", "")
          .with("courses", query => {
            query.where("date", this.date).orderBy("time", "asc");
          })
          .with("courses.patient")
          .orderBy("order", "asc")
          .orderBy("name", "asc")
          .get();
      },
      set(chauffeurs) {
        chauffeurs.forEach((chauffeur, index) => {
          if (chauffeur.order !== index) {
            chauffeur.update({ order: index });
          }
        });
      }
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
    allCourses() {
      return this.courses.concat(this.recurringCourses);
    },
    coursesToday() {
      if (this.currentDate) {
        return this.allCourses
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
        event.added.element.update({
          chauffeur_id: chauffeur
            ? chauffeur.id
            : firebase.firestore.FieldValue.delete()
        });
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
.chauffeur {
  min-height: 40vh;
  max-height: 40vh;
  width: 300px;
  min-width: 200px;
  max-width: 300px;
  flex: 0 0 300px;
}
.scroll {
  overflow-y: scroll;
}

.title-scroll {
  position: sticky !important;
  z-index: 11 !important;
  position: fixed;
  &.gradient {
    background: linear-gradient(
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0)
    );
  }
}
.handle-chauffeur {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 100;
}
</style>
