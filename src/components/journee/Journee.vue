<template>
  <div
    class="pa-0 ma-0 d-flex flex-grow-1 align-stretch flex-column day-container"
    style="position: relative; overflow:hidden; max-width: 100%;"
  >
    <div
      ref="coursesList"
      class="d-flex flex-grow-1 flex-shrink-1 flex-column align-stretch col-12 pa-0"
      style="position: relative; overflow:hidden; max-width: 100%;"
    >
      <v-tabs
        v-model="tab"
        centered
        class="flex-grow-0 elevation-1"
        style="z-index: 1;"
      >
        <v-tab
          key="journee"
          class="d-flex flex-column align-center justify-center"
        >
          <span>Courses de la journée</span>
          <v-progress-linear
            v-if="admin"
            height="10"
            striped
            rounded
            :value="
              (coursesTodayPlanifiedDone.length * 100) /
                coursesTodayPlanified.length
            "
            class="flex-shrink-0"
          >
            <small>
              <strong>
                {{ coursesTodayPlanifiedDone.length }} /
                {{ coursesTodayPlanified.length }}
              </strong>
            </small>
          </v-progress-linear>
        </v-tab>
        <v-tab v-if="admin" key="validees">Validées</v-tab>
        <v-tab v-if="admin" key="annulees">Annulées</v-tab>
        <div v-if="admin" class="add-button" disabled>
          <v-dialog v-model="dialog" width="600">
            <template v-slot:activator="{ on }">
              <v-btn small text v-on="on">
                <v-icon>mdi-plus-circle</v-icon> Ajouter course
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                Ajouter course
                <v-spacer></v-spacer>
                <v-btn icon @click="resetNewCourses()">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <course-item
                  class="mb-6"
                  :course="newCourseAller"
                  :hide-chauffeur="true"
                  :prevent-update="true"
                >
                </course-item>
                <course-item
                  class="mb-6"
                  :course="newCourseRetour"
                  :hide-chauffeur="true"
                  :prevent-update="true"
                >
                </course-item>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  text
                  :disabled="!(newCourseAller.time && newCourseAller.patient)"
                  @click="addCourse(newCourseAller)"
                >
                  Créer Aller
                </v-btn>
                <v-btn
                  text
                  :disabled="!(newCourseRetour.time && newCourseRetour.patient)"
                  @click="addCourse(newCourseRetour)"
                >
                  Créer Retour
                </v-btn>
                <v-btn
                  text
                  :disabled="
                    !(newCourseAller.time && newCourseAller.patient) ||
                      !(newCourseRetour.time && newCourseRetour.patient)
                  "
                  @click="addCourses([newCourseAller, newCourseRetour])"
                >
                  Créer Aller/Retour
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-tabs>
      <v-tabs-items
        ref="tab-container"
        v-model="tab"
        class="flex-grow-1"
        style="overflow-y: auto; z-index: 0; position:relative;"
      >
        <v-tab-item key="journee">
          <v-list class="transparent pa-2 col-12" dense>
            <v-subheader v-if="coursesTodayUnplanifiedFiltered.length > 0">
              Courses à planifier
            </v-subheader>

            <template
              v-if="admin && coursesTodayUnplanifiedFiltered.length > 0"
            >
              <transition-group name="list" tag="div">
                <v-list-item
                  v-for="(course, index) in coursesTodayUnplanifiedFiltered"
                  :key="`${course.ref}`"
                  :index="index"
                  class="col-12 ma-0"
                >
                  <v-list-item-content
                    class="show-overflow justify-center align-center col-12"
                  >
                    <course-item
                      :course="course"
                      :index="index"
                      :hide-chauffeur="true"
                    ></course-item>
                  </v-list-item-content>
                </v-list-item>
              </transition-group>
            </template>

            <v-divider
              v-if="coursesTodayUnplanifiedFiltered.length > 0 && admin"
            ></v-divider>

            <div
              v-for="hour in hoursTodayPlanifiedFiltered"
              :key="`${hour}-key`"
            >
              <div
                v-if="coursesByHourTodayPlanifiedFiltered[hour].length"
                style="position: sticky; left: 0; top: 8px; right: 0; border-top: dotted 2px #e0e0e0;"
              >
                <div
                  style="position: absolute; top: 0; left: 0; background: white;"
                >
                  <span style="color: #e0e0e0;">
                    <b> {{ hour }}:00 </b>
                  </span>
                  <template v-if="admin">
                    <br />
                    <span style="color: #e0e0e0;">
                      <b>
                        {{
                          coursesByHourTodayPlanified[hour].filter(
                            course => course.doneDate
                          ).length
                        }}
                      </b>
                      /
                      {{ coursesByHourTodayPlanified[hour].length }} courses
                    </span>
                    <br />
                    <span style="color: #e0e0e0;">
                      {{
                        coursesByHourTodayPlanifiedFiltered[hour].filter(
                          course => !course.chauffeur
                        ).length
                      }}
                      courses non-attribuées
                    </span>
                  </template>
                </div>

                <template v-if="admin">
                  <div
                    style="position: absolute; top: 0; right: 0; background: white;  text-align: right;"
                  >
                    <template v-for="type in typeKeys">
                      <span :key="type" style="color: #e0e0e0;">
                        {{ type }}
                        <b
                          :style="{
                            color: coursesByHourTodayPlanifiedFiltered[
                              hour
                            ].filter(
                              course =>
                                (course.type || course.patient.type) === type
                            ).length
                              ? Types[type].color
                              : '#e0e0e0'
                          }"
                        >
                          {{
                            coursesByHourTodayPlanifiedFiltered[hour].filter(
                              course =>
                                (course.type || course.patient.type) === type
                            ).length
                          }}
                        </b>
                      </span>
                      <br :key="`${type}-br`" />
                    </template>
                  </div>
                </template>
              </div>

              <transition-group name="list" tag="div">
                <template
                  v-for="(course, index) in coursesByHourTodayPlanifiedFiltered[
                    hour
                  ]"
                >
                  <v-list-item :key="`${course.ref}`" :index="index">
                    <v-list-item-content
                      class="show-overflow justify-center align-center col-12"
                    >
                      <course-item
                        :style="{
                          opacity: course.deleted ? '0.3' : '1'
                        }"
                        :course="course"
                        :index="index"
                      ></course-item>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </transition-group>
            </div>
          </v-list>
        </v-tab-item>
        <v-tab-item v-if="admin" key="validees">
          <v-list class="transparent pa-2" dense>
            <transition-group name="list2" tag="div">
              <v-list-item
                v-for="(course, index) in coursesTodayValidated"
                :key="`${course.ref}`"
                :index="index"
              >
                <v-list-item-content
                  class="show-overflow justify-center align-center col-12"
                >
                  <course-item
                    :course="course"
                    :index="index"
                    :hide-details="true"
                    :lazy-size="132"
                  ></course-item>
                </v-list-item-content>
              </v-list-item>
            </transition-group>
          </v-list>
        </v-tab-item>
        <v-tab-item v-if="admin" key="annulees">
          <v-list class="transparent pa-2" dense>
            <transition-group name="list2" tag="div">
              <v-list-item
                v-for="(course, index) in coursesTodayDeleted"
                :key="`${course.ref}`"
                :index="index"
              >
                <v-list-item-content
                  class="show-overflow justify-center align-center"
                >
                  <course-item
                    :course="course"
                    :index="index"
                    :hide-details="true"
                    :lazy-size="84"
                  ></course-item>
                </v-list-item-content>
              </v-list-item>
            </transition-group>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
      <div
        v-if="admin"
        style="position: absolute; top: 48px; left: 0; bottom: 0;z-index: 100;"
      >
        <div
          class="courses-progress"
          :style="{
            borderColor: 'rgba(0, 0, 0, 100%)',
            background:
              'linear-gradient(to right,rgba(0, 0, 0, 50%) 0%,rgba(0, 0, 0, 0%) 100%)',
            height: `${(coursesTodayDeleted.length / totalCourses) * 100}%`
          }"
        ></div>
        <div
          class="courses-progress"
          :style="{
            borderColor: 'rgba(0, 255, 0, 100%)',
            background:
              'linear-gradient(to right,rgba(0, 255, 0, 50%) 0%,rgba(0, 255, 0, 0%) 100%)',
            height: `${(coursesTodayValidated.length / totalCourses) * 100}%`
          }"
        ></div>
        <div
          class="courses-progress"
          :style="{
            borderColor: 'rgba(255, 255, 0, 100%)',
            background:
              'linear-gradient(to right,rgba(255, 255, 0, 50%) 0%,rgba(255, 255, 0, 0%) 100%)',
            height: `${(coursesTodayUnplanifiedFiltered.length / totalCourses) *
              100}%`
          }"
        ></div>
        <div
          class="courses-progress"
          :style="{
            borderColor: 'rgba(0, 0, 255, 100%)',
            background:
              'linear-gradient(to right,rgba(0, 0, 255, 50%) 0%,rgba(0, 0, 255, 0%) 100%)',
            height: `${(coursesTodayPlanifiedFiltered.filter(
              course => course.chauffeur
            ).length /
              totalCourses) *
              100}%`
          }"
        ></div>
        <div
          class="courses-progress"
          :style="{
            borderColor: 'rgba(100, 100, 100, 100%)',
            background:
              'linear-gradient(to right,rgba(100, 100, 100, 50%) 0%,rgba(100, 100, 100, 0%) 100%)',
            height: `${(coursesTodayPlanifiedFiltered.filter(
              course => !course.chauffeur
            ).length /
              totalCourses) *
              100}%`
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import Course from "@/models/Course";
import Patient from "@/models/Patient";
import CourseItem from "./CourseItem";
import { mapState } from "vuex";
import uuid from "uuid";
import Types from "../../database/types";

export default {
  name: "Journee",
  components: {
    CourseItem
  },
  data() {
    return {
      Types,
      tab: "journee",
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
      dialog: false,
      newCourse: new Course({
        date: this.date,
        deleted: "",
        doneDate: "",
        ref: `${this.date}.${uuid.v4()}`
      }),
      newCourseAller: new Course({
        date: this.date,
        deleted: "",
        doneDate: "",
        ref: `${this.date}.${uuid.v4()}.Aller`
      }),
      newCourseRetour: new Course({
        date: this.date,
        deleted: "",
        doneDate: "",
        ref: `${this.date}.${uuid.v4()}.Retour`
      })
    };
  },
  computed: {
    ...mapState(["currentDate", "admin"]),
    totalCourses() {
      return (
        this.coursesTodayDeleted.length +
        this.coursesTodayValidated.length +
        this.coursesTodayUnplanifiedFiltered.length +
        this.coursesTodayPlanifiedFiltered.length
      );
    },
    typeKeys() {
      return Object.keys(Types);
    },
    now() {
      const d = new Date();
      const hour = `${d.getHours()}`;
      const minutes = `${d.getMinutes()}`;
      return `${hour.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    },
    recurringCourses() {
      if (this.admin) {
        return this.patients
          .filter(patient => !patient.deleted)
          .filter(patient => {
            return (
              patient[this.currentDay] || patient[`${this.currentDay}Retour`]
            );
          })
          .reduce((result, patient) => {
            if (patient[this.currentDay]) {
              result.push(
                new Course({
                  ref: `${this.date}.${patient.id}.Aller`,
                  date: this.date,
                  time: patient[this.currentDay],
                  patient: {
                    ...Patient.find(patient.id),
                    place: patient.place
                  },
                  generated: true,
                  societe: patient.societe,
                  deleted: "",
                  doneDate: "",
                  type: patient.type
                })
              );
            }
            if (patient[`${this.currentDay}Retour`]) {
              result.push(
                new Course({
                  ref: `${this.date}.${patient.id}.Retour`,
                  date: this.date,
                  time: patient[this.currentDay + "Retour"],
                  patient: {
                    ...Patient.find(patient.id),
                    place: patient.place
                  },
                  generated: true,
                  societe: patient.societe,
                  deleted: "",
                  doneDate: "",
                  type: patient.type
                })
              );
            }
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
        .with("patient.place")
        .get();
    },
    patients() {
      return Patient.query()
        .with("place")
        .get();
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
        .filter(course => !course.deleted)
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
    coursesTodayDeleted() {
      return this.coursesToday
        .filter(course => !!course.deleted)
        .sort((a, b) => {
          if (a.time === "") return 0;
          if (b.time === "") return 0;
          if (a.time < b.time) return -1;
          return 1;
        });
    },
    coursesTodayValidated() {
      return this.coursesToday
        .filter(course => !!course.doneDate)
        .sort((a, b) => {
          if (a.time === "") return 0;
          if (b.time === "") return 0;
          if (a.time < b.time) return -1;
          return 1;
        });
    },
    coursesTodayUnplanifiedFiltered() {
      return this.coursesTodayUnplanified.filter(
        course => !course.doneDate && !course.deleted
      );
    },
    coursesTodayPlanifiedFiltered() {
      return this.coursesTodayPlanified.filter(
        course => !course.doneDate && !course.deleted
      );
    },
    coursesByHourTodayPlanifiedFiltered() {
      return this.hoursTodayPlanifiedFiltered.reduce((hours, hour) => {
        hours[hour] = this.coursesTodayPlanifiedFiltered.filter(course => {
          return course.time.split(":")[0] === hour;
        });
        return hours;
      }, {});
    },
    coursesByHourTodayPlanified() {
      return this.hoursTodayPlanifiedFiltered.reduce((hours, hour) => {
        hours[hour] = this.coursesTodayPlanified.filter(course => {
          return course.time.split(":")[0] === hour;
        });
        return hours;
      }, {});
    },
    hoursTodayPlanifiedFiltered() {
      return Array.from(
        new Set(
          this.coursesTodayPlanified.map(course => course.time.split(":")[0])
        )
      );
    },
    currentDay() {
      return this.days[new Date(this.currentDate).getDay()].toLowerCase();
    }
  },
  watch: {
    currentDate() {
      this.$refs["tab-container"].$el.scrollTop = 0;
    },
    "newCourseAller.type": {
      handler() {
        this.newCourseRetour.type = this.newCourseAller.type;
      }
    },
    "newCourseAller.patient": {
      handler() {
        this.newCourseRetour.patient = this.newCourseAller.patient;
      }
    },
    "newCourseRetour.type": {
      handler() {
        this.newCourseAller.type = this.newCourseRetour.type;
      }
    },
    "newCourseRetour.patient": {
      handler() {
        this.newCourseAller.patient = this.newCourseRetour.patient;
      }
    }
  },
  methods: {
    logOut() {
      firebase.auth().signOut();
    },
    addCourse(course) {
      const _c = JSON.parse(JSON.stringify(course.$toJson()));
      Course.create({ ..._c, date: this.date });
      this.resetNewCourses();
    },
    addCourses(courses) {
      courses.forEach(course => {
        const _c = JSON.parse(JSON.stringify(course.$toJson()));
        Course.create({ ..._c, date: this.date });
      });
      this.resetNewCourses();
    },
    resetNewCourses() {
      this.newCourseAller = new Course({
        date: this.date,
        deleted: "",
        doneDate: "",
        ref: `${this.date}.${uuid.v4()}.Aller`
      });
      this.newCourseRetour = new Course({
        date: this.date,
        deleted: "",
        doneDate: "",
        ref: `${this.date}.${uuid.v4()}.Retour`
      });
      this.dialog = false;
    }
  }
};
</script>

<style scoped lang="scss">
.courses-progress {
  width: 6px;
  border-left: solid 1px;
  position: relative;
}

.day-container {
  height: calc(100%);
}
.unplanned {
  width: 400px;
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

.list-enter-active,
.list-leave-active {
  transition: all 0.6s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(50%);
}
.list-move {
  transition: transform 1s;
}

.list2-enter-active,
.list2-leave-active {
  transition: all 0.6s;
}
.list2-enter, .list2-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-50%);
}

.add-button {
  align-self: center;
}
</style>
