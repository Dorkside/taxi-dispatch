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
      <v-list class="transparent pa-2 col-12 courses" dense>
        <template v-if="admin && coursesTodayValidated.length > 0">
          <transition-group name="list" tag="div">
            <v-list-item
              v-for="(course, index) in coursesTodayValidated"
              :key="`${course.ref}`"
              :index="index"
              class="col-12 ma-0 pa-0"
            >
              <v-list-item-content
                class="show-overflow justify-center align-center col-12"
              >
                <bons-item
                  :course="course"
                  :index="index"
                  :hide-chauffeur="true"
                ></bons-item>
              </v-list-item-content>
            </v-list-item>
          </transition-group>
        </template>
      </v-list>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import Course from "@/models/Course";
import Patient from "@/models/Patient";
import BonsItem from "./BonsItem";
import { mapState } from "vuex";
import Types from "../../database/types";

export default {
  name: "Bons",
  components: {
    BonsItem
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
      ]
    };
  },
  computed: {
    ...mapState(["currentDate", "admin"]),
    typeKeys() {
      return Object.keys(Types);
    },
    now() {
      const d = new Date();
      const hour = `${d.getHours()}`;
      const minutes = `${d.getMinutes()}`;
      return `${hour.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
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
    coursesToday() {
      if (this.currentDate) {
        return this.courses.filter(course => course.date === this.date);
      }
      return [];
    },
    coursesTodayValidated() {
      return this.coursesToday
        .filter(course => !!course.doneDate && !course.deleted)
        .sort((a, b) => {
          if (a.time === "") return 0;
          if (b.time === "") return 0;
          if (a.time < b.time) return -1;
          return 1;
        })
        .filter(course =>
          [
            "Consultation",
            "Chimiothérapie",
            "Entrée d'hôpital",
            "Radiothérapie"
          ].includes(course.type)
        );
    },
    currentDay() {
      return this.days[new Date(this.currentDate).getDay()].toLowerCase();
    }
  },
  watch: {
    currentDate() {
      this.$refs["tab-container"].$el.scrollTop = 0;
    }
  },
  methods: {
    logOut() {
      firebase.auth().signOut();
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

.courses {
  max-height: 100%;
  overflow-y: scroll;
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
