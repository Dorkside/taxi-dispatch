<template>
  <div
    class="d-flex align-stretch pa-0 overflow-hidden"
    :style="{ position: 'relative', height: '100%' }"
    @click="clicked = undefined"
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
      <draggable
        class="d-flex flex-column justify-stretch flex-grow-1 flex-shrink-1 pa-2 pr-4 pt-10"
        style="overflow-x: hidden; position: absolute; top: 0; left: 0; bottom: 0; width: 300px;"
        :value="coursesTodayUnplanified"
        handle=".handle"
        :sort="true"
        group="courses"
        fill-height
        @change="moveCourse($event, null)"
      >
        <v-list-item
          v-for="(course, index) in coursesTodayUnplanified"
          :key="`${course.id || course.ref}`"
          style="max-width: 100%;"
          class="mb-1 pa-0 flex-grow-1 flex-shrink-1"
        >
          <depart-item :course="course" :index="index"></depart-item>
        </v-list-item>
      </draggable>
    </v-list>
    <div
      class="d-flex flex-column flex-grow-1 flex-shrink-1 overflow-hidden"
      style="position: relative; min-height: 100%;"
    >
      <v-tabs v-model="tab" style="border-bottom: solid 2px #e0e0e0;">
        <v-tab key="cards"><v-icon>mdi-grid</v-icon></v-tab>
        <v-tab key="lines">
          <v-icon>{{ mdiViewAgendaOutline }}</v-icon>
        </v-tab>
      </v-tabs>
      <v-tabs-items
        v-model="tab"
        style="position: relative; overflow-y: auto; overflow-x: auto;"
        class="flex-grow-1"
      >
        <v-tab-item key="cards">
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
              style="overflow: hidden;"
              class="ma-2 chauffeur pa-0 flex-shrink-1 flex-grow-1 elevation-2"
            >
              <v-subheader class="title-scroll" style="top: -16px;">
                <v-chip
                  style="position:absolute; top: 0; left: 0; border-radius: 4px 0 12px 0;"
                >
                  <b>{{ chauffeur.name }}</b>
                  <small>&nbsp;({{ chauffeur.courses.length }} courses)</small>
                </v-chip>
              </v-subheader>

              <v-list
                class="d-flex flex-column align-stretch overflow-y-auto"
                style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;"
                :style="{ background: 'transparent' }"
              >
                <draggable
                  :value="chauffeur.courses"
                  :sort="true"
                  handle=".handle"
                  group="courses"
                  :style="{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                  }"
                  class="pt-10 pa-2"
                  @change="moveCourse($event, chauffeur)"
                >
                  <depart-item
                    v-for="(course, index) in chauffeur.courses"
                    :key="`${course.id || course.ref}`"
                    :course="course"
                    class="my-1 px-2"
                    :index="index"
                  ></depart-item>
                </draggable>
              </v-list>

              <v-chip
                style="position:absolute; top: 0; right: 0; border-radius: 0 4px 0 12px;"
                class="handle-chauffeur"
              >
                <v-icon small>
                  mdi-drag
                </v-icon>
              </v-chip>
            </v-card>
          </draggable>
        </v-tab-item>
        <v-tab-item key="lines">
          <div
            class="d-flex flex-column"
            :style="{ width: `${24 * 12 * 26}px`, position: 'relative' }"
          >
            <div
              class="d-flex flex-row flex-nowrap flex-shrink-0"
              style="position: sticky; top: 0; left: 0; height: 100vh; pointer-events: none;"
            >
              <div
                v-for="hour in dayHours"
                :key="hour"
                class="d-flex flex-column"
                style="height: 100%;"
              >
                <div class="pa-1">{{ hour }}</div>
                <div
                  class="d-flex flex-row flex-nowrap"
                  style="position:relative; height: 100%;"
                >
                  <div
                    v-for="minute in dayMinutes"
                    :key="minute"
                    class="flex-shrink-0 pa-1"
                    :class="{
                      timeline: Number(minute) % 15 === 0,
                      hour: Number(minute) % 60 === 0
                    }"
                    :style="{
                      position: 'relative',
                      opacity: Number(minute) % 15 === 0 ? 1 : 0.5
                    }"
                  >
                    {{ minute }}
                  </div>
                </div>
              </div>
            </div>
            <draggable
              v-model="chauffeurs"
              handle=".handle-chauffeur"
              :sort="true"
              group="chauffeurs"
              class="pa-0 scroll"
              style="position: absolute; top: 64px; left: 0; right: 0; bottom: 0;"
            >
              <div
                v-for="chauffeur of chauffeurs"
                :key="chauffeur.id"
                style="overflow: hidden; position: relative; min-width: 100%; min-height: 108px;"
                class="ma-0 pa-0 flex-shrink-1 flex-grow-1 elevation-0 chauffeur-line"
              >
                <draggable
                  :value="chauffeur.courses"
                  group="courses"
                  :style="{
                    minHeight: `${16 + (1 + chauffeur.maxOverlap) * 92}px`
                  }"
                  style="position: relative;"
                  @change="moveCourse($event, chauffeur)"
                >
                  <draggable
                    :value="chauffeur.coursesWithOverlap"
                    group="courses"
                    @change="moveCourse($event, chauffeur)"
                    @start="startDragging"
                    @end="dragging = undefined"
                  >
                    <template v-for="(course, index) in chauffeur.courses">
                      <depart-item
                        :key="`${course.id || course.ref}`"
                        :course="course"
                        :index="index"
                        :compact="true"
                        :is-dragging="course.id === dragging"
                        :is-clicked="course.id === clicked"
                        :left-offset="leftOffset(course.time)"
                        style="margin: 0 auto"
                        @clicked="clicked = course.id"
                      ></depart-item>
                    </template>
                  </draggable>
                </draggable>
              </div>
            </draggable>

            <div style="height: 64px"></div>
            <div
              style="position:sticky; pointer-events: none; left: 0; width: 150px; margin-top: -100vh"
            >
              <template v-for="chauffeur of chauffeurs">
                <v-chip
                  :key="`${chauffeur.id || course.ref}-chauffeur`"
                  style="border-radius: 0 0 12px 0; margin-bottom: 76px;"
                  :style="{
                    marginBottom: `${76 + 92 * chauffeur.maxOverlap}px`
                  }"
                >
                  <b>{{ chauffeur.name }}</b>
                  <small>&nbsp;({{ chauffeur.courses.length }} courses)</small>
                </v-chip>
              </template>
            </div>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import { mdiViewAgendaOutline } from "@mdi/js";
import draggable from "vuedraggable";

import Course from "@/models/Course";
import Chauffeur from "@/models/Chauffeur";
import Patient from "@/models/Patient";
import DepartItem from "./DepartItem";
import { mapState } from "vuex";

import { deleteField } from "firebase/firestore";

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
      ],
      mdiViewAgendaOutline,
      tab: "lines",
      dragging: undefined,
      clicked: undefined
    };
  },
  computed: {
    ...mapState(["currentDate", "admin"]),
    dayHours() {
      return new Array(24)
        .fill(0)
        .map((n, index) => `${index}`.padStart(2, "0"));
    },
    dayMinutes() {
      return new Array(60 / 5)
        .fill(0)
        .map((n, index) => `${index * 5}`.padStart(2, "0"));
    },
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
    startDragging(e) {
      console.log(e);
      this.dragging = e.item._underlying_vm_.id;
    },
    moveCourse(event, chauffeur) {
      console.log(event, chauffeur);
      if (event.added) {
        event.added.element.update({
          chauffeur_id: chauffeur ? chauffeur.id : deleteField()
        });
      }
    },
    leftOffset(time) {
      if (time) {
        const [hours, minutes] = time.split(":");
        return Math.floor((Number(hours) * 12 + Number(minutes) / 5) * 26);
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
.timeline {
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    border-left: solid 1px black;
    opacity: 0.2;
  }
  &.hour::after {
    opacity: 1;
  }
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
  z-index: 100;
}
.chauffeur-line {
  background: none;
}
.chauffeur-line:nth-child(2n) {
  background: rgba(0, 0, 0, 0.05);
}
</style>
