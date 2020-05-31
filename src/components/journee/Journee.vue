<template>
  <div class="pa-0 ma-0 d-flex align-stretch flex-column day-container">
    <v-subheader
      v-if="admin"
      class="d-flex flex-grow-0 flex-shrink-0 elevation-2"
      style="z-index: 10;"
    >
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

      <v-dialog v-model="dialog" width="600">
        <template v-slot:activator="{ on }">
          <v-btn small text style="position: absolute; right: 16px;" v-on="on">
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
            Aller
            <course-item
              :course="newCourseAller"
              :hide-chauffeur="true"
              :prevent-update="true"
            >
            </course-item>
            Retour
            <course-item
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
    </v-subheader>

    <v-subheader
      v-if="!admin"
      class="d-flex flex-grow-0 flex-shrink-0 elevation-2"
      style="z-index: 10;"
    >
      <v-spacer></v-spacer>
      <v-btn color="primary" right @click="logOut">
        <v-icon left>mdi-close</v-icon>
        Déconnexion
      </v-btn>
    </v-subheader>
    <div
      ref="coursesList"
      class="d-flex flex-grow-1 flex-shrink-1 flex-column align-stretch"
      style="position: relative; overflow:hidden;"
    >
      <v-tabs
        v-model="tab"
        centered
        class="flex-grow-0 elevation-1"
        style="z-index: 1;"
      >
        <v-tab key="journee">Courses de la journée</v-tab>
        <v-tab v-if="admin" key="validees">Courses validées</v-tab>
        <v-tab v-if="admin" key="annulees">Courses annulées</v-tab>
      </v-tabs>
      <v-tabs-items
        ref="tab-container"
        v-model="tab"
        class="flex-grow-1"
        style="overflow-y: auto; z-index: 0;"
      >
        <v-tab-item key="journee">
          <v-list class="transparent pa-2" dense>
            <v-subheader v-if="coursesTodayUnplanifiedFiltered.length > 0">
              Courses à planifier
            </v-subheader>

            <template
              v-if="admin && coursesTodayUnplanifiedFiltered.length > 0"
            >
              <v-list-item
                v-for="(course, index) in coursesTodayUnplanifiedFiltered"
                :key="`${course.ref}-${course.id}`"
                :index="index"
              >
                <v-list-item-content
                  class="show-overflow justify-center align-center"
                >
                  <course-item
                    :course="course"
                    :index="index"
                    :hide-chauffeur="true"
                  ></course-item>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-divider
              v-if="coursesTodayUnplanifiedFiltered.length > 0 && admin"
            ></v-divider>

            <v-list-item
              v-for="(course, index) in coursesTodayPlanifiedFiltered"
              :key="`${course.ref}-${course.id}`"
              :index="index"
            >
              <v-list-item-content
                class="show-overflow justify-center align-center"
              >
                <course-item
                  :key="`${course.ref}-${course.id}`"
                  :style="{
                    opacity: course.deleted ? '0.3' : '1'
                  }"
                  :course="course"
                  :index="index"
                ></course-item>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>
        <v-tab-item v-if="admin" key="validees">
          <v-list class="transparent pa-2" dense>
            <v-list-item
              v-for="(course, index) in coursesTodayValidated"
              :key="`${course.ref}-${course.id}`"
              :index="index"
            >
              <v-list-item-content
                class="show-overflow justify-center align-center"
              >
                <course-item
                  :key="`${course.ref}-${course.id}`"
                  :course="course"
                  :index="index"
                ></course-item>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>
        <v-tab-item v-if="admin" key="annulees">
          <v-list class="transparent pa-2" dense>
            <v-list-item
              v-for="(course, index) in coursesTodayDeleted"
              :key="`${course.ref}-${course.id}`"
              :index="index"
            >
              <v-list-item-content
                class="show-overflow justify-center align-center"
              >
                <course-item
                  :key="`${course.ref}-${course.id}`"
                  :course="course"
                  :index="index"
                ></course-item>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import Course from "@/models/Course";
import Patient from "@/models/Patient";
import CourseItem from "./CourseItem";
import { mapState } from "vuex";
import uuid from "uuid";
export default {
  name: "Journee",
  components: {
    CourseItem
  },
  data() {
    return {
      tab: "",
      days: [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi"
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
      return this.coursesToday.filter(course => !!course.deleted);
    },
    coursesTodayValidated() {
      return this.coursesToday.filter(course => !!course.doneDate);
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
      this.resetNewCourse();
    },
    addCourses(courses) {
      courses.forEach(course => {
        const _c = JSON.parse(JSON.stringify(course.$toJson()));
        Course.create({ ..._c, date: this.date });
      });
      this.resetNewCourses();
    },
    resetNewCourse() {
      this.newCourse = new Course({
        date: this.date,
        deleted: "",
        doneDate: "",
        ref: `${this.date}.${uuid.v4()}`
      });
      this.dialog = false;
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
.day-container {
  height: 100%;
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
</style>
