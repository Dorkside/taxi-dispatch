<template>
  <div class="d-flex flex-column pa-0" :style="{ height: '100%' }">
    <div
      class="d-flex blue accent-1 action-bar py-0 px-4 elevation-2 align-center flex-grow-0 flex-shrink-0"
    >
      <v-text-field
        v-model="searchTerms"
        prepend-inner-icon="mdi-magnify"
        class="flex-grow-1 flex-shrink-0"
        label="Recherche"
        dense
        clearable
      >
      </v-text-field>
    </div>

    <v-dialog v-model="dialog" width="500" class="pa-0">
      <v-card v-if="dialogData">
        <v-card-title
          class="headline grey lighten-2 d-flex space-between"
          primary-title
        >
          <span class="flex-grow-1">
            {{ dialogData.name }}
          </span>

          <v-btn text icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Date</th>
                  <th class="text-left">Heure</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="course in coursesByPatient[dialogData.id]"
                  :key="course.id"
                >
                  <td>{{ prettyDate(course.date) }}</td>
                  <td>{{ course.time }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <div class="scroller flex-grow-1 flex-shrink-1">
      <v-expansion-panels v-if="courses.length > 0" :value="0">
        <v-expansion-panel v-for="(month, i) in months" :key="i">
          <v-expansion-panel-header @click="setMonth(month.date)">
            {{ month.string }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <template v-for="patient in filteredPatients">
              <div :key="patient.id" class="pa-0 patient d-flex align-center">
                <v-avatar
                  :style="{ backgroundColor: patient.color }"
                  size="36"
                  class="white--text"
                >
                  {{ patient.shortType }}
                </v-avatar>

                <span class="mx-2 flex-grow-1">{{ patient.name }}</span>

                <v-btn
                  dark
                  @click="
                    dialogData = patient;
                    dialog = true;
                  "
                >
                  {{ coursesByPatient[patient.id].length }} course{{
                    coursesByPatient[patient.id].length > 1 ? "s" : ""
                  }}
                </v-btn>
              </div>
              <v-divider :key="'_' + patient.id"></v-divider>
            </template>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
import Course from "@/models/Course";
import * as dayjs from "dayjs";
export default {
  name: "Facturation",
  data() {
    return {
      searchTerms: "",
      dialog: false,
      dialogData: null,
      currentMonth: dayjs().format("YYYY-MM") + "-01"
    };
  },
  computed: {
    courses() {
      return Course.query()
        .where("deleted", "")
        .with("chauffeur")
        .with("patient")
        .get();
    },
    months() {
      return this.courses
        .reduce((months, course) => {
          const month = course.date.slice(0, 7);
          if (!months.includes(month)) {
            months.push(month);
          }
          return months;
        }, [])
        .sort()
        .reverse()
        .map(month => ({
          date: month,
          string: dayjs(`${month}-01`).format("MMMM YYYY")
        }));
    },
    monthlyCourses() {
      return this.courses.filter(course => {
        return dayjs(course.date).isSame(this.currentMonth, "month");
      });
    },
    patients() {
      return this.monthlyCourses
        .reduce((patients, course) => {
          if (course.patient) {
            if (!patients.includes(course.patient)) {
              patients.push(course.patient);
            }
          }
          return patients;
        }, [])
        .sort((a, b) => (a.name > b.name ? -1 : 1));
    },
    coursesByPatient() {
      return this.monthlyCourses.reduce((patients, course) => {
        if (!patients[course.patient.id]) patients[course.patient.id] = [];
        patients[course.patient.id].push(course);
        return patients;
      }, {});
    },
    search() {
      return this.searchTerms.toLowerCase().split(" ");
    },
    filteredPatients() {
      if (this.searchTerms) {
        return this.patients.filter(patient => {
          return this.search.every(s => {
            return patient.name.toLowerCase().includes(s);
          });
        });
      }
      return this.patients;
    }
  },
  methods: {
    setMonth(date) {
      this.currentMonth = date + "-01";
    },
    prettyDate(date) {
      return dayjs(date).format("dddd D MMMM YYYY");
    }
  }
};
</script>

<style scoped lang="scss">
.action-bar {
  z-index: 2;
  position: sticky;
  min-height: 64px;
  top: 0;
}
.scroller {
  width: 100%;
  overflow-y: auto;
}
.patient {
  height: 72px;
  .type {
    width: 200px;
  }
}
</style>
