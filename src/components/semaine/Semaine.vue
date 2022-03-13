<template>
  <div
    class="d-flex flex-column pa-0 ma-0 z-index-8 align-start"
    :style="{ height: '100%' }"
  >
    <div
      class="d-flex amber darken-2 action-bar py-0 px-4 elevation-2 pa-0 align-center flex-grow-0 flex-shrink-0"
    >
      <v-text-field
        v-model="searchTerms"
        hide-details
        prepend-inner-icon="mdi-magnify"
        class="flex-grow-1"
        label="Recherche"
        dense
        clearable
      >
      </v-text-field>
      <v-btn text @click="addPatient()">
        <v-icon>mdi-plus-circle</v-icon> Ajouter patient
      </v-btn>
    </div>

    <section class="scroller d-flex flex-column justify-start align-center">
      <v-lazy
        v-for="item in filteredPatients"
        :key="item.id"
        min-height="252"
        class="ma-4 bgTest"
      >
        <v-card
          style="width: 450px; min-height: 228px; margin-right: 100px !important;"
        >
          <v-card-title class="flex-grow-1">
            {{ item.surname }} {{ item.name }}

            <v-icon
              v-if="item.assistance"
              class="ml-4"
              color="green darken-2"
              >{{ mdiHumanWheelchair }}</v-icon
            >
          </v-card-title>

          <div class="d-flex">
            <div class="d-flex flex-column justify-start align-stretch mr-4">
              <v-chip class="ml-4 mb-1" :style="{ minWidth: '100px' }">
                <v-icon>mdi-phone</v-icon>
                {{ item.telephone || "???" }}
              </v-chip>
              <v-chip class="ml-4 mb-1" :style="{ minWidth: '100px' }">
                <v-icon>mdi-hospital-building</v-icon>
                {{ item.place ? item.place.name : "???" }}
              </v-chip>
              <v-chip class="ml-4" :style="{ minWidth: '100px' }">
                <v-icon>mdi-home-map-marker</v-icon>
                {{ item.adresse || "???" }}
              </v-chip>
            </div>

            <div v-if="item.note" class="d-flex flex-column">
              <small><i>Notes</i></small>
              <span>{{ item.note }}</span>
            </div>
          </div>

          <v-chip
            pill
            class="elevation-0"
            style="position: absolute; right: 0px; top: 0px; border-radius: 0 4px 0 12px;"
          >
            <v-avatar
              left
              style="border-radius: 0;"
              :style="{ backgroundColor: item.color, marginRight: '4px' }"
              class="white--text"
            >
              {{ item.shortType }}
            </v-avatar>
            <span>
              {{ item.type }}
            </span>
          </v-chip>

          <v-chip
            v-if="item"
            class="elevation-0"
            style="position:absolute; left: 0px; bottom: 0px; border-radius: 0 12px 0 4px;"
          >
            {{ item.societe || "Aucune société" }}
          </v-chip>

          <div
            v-if="item.schedules"
            class="d-flex flex-column align-start"
            style="position:absolute; right: 12px; top:32px; transform: translateX(100%)"
          >
            <v-chip
              v-for="day in Object.entries(item.schedules)"
              :key="day[0]"
              small
              class="pa-1 pl-0 mb-1 elevation-2"
              :style="{
                opacity:
                  day[1].a === '--:--' && day[1].r === '--:--' ? '0.5' : '1'
              }"
            >
              <v-avatar
                size="24"
                :style="{
                  backgroundColor: item.color,
                  marginRight: '4px'
                }"
                class="white--text"
              >
                {{ day[0] }}
              </v-avatar>
              {{ day[1].a }} / {{ day[1].r }}
            </v-chip>
          </div>

          <v-card-text
            style="display: flex; flex-flow: row nowrap; align-items: center; min-width: 200px;"
            class="py-6 px-4"
          >
            <v-spacer></v-spacer>
          </v-card-text>

          <v-card-actions>
            <v-row align="center" justify="end">
              <v-btn
                text
                class="ma-1"
                @click="
                  dialogHistory = true;
                  dialogPatientData = item;
                "
              >
                <v-icon>mdi-clock-outline</v-icon> Historique
              </v-btn>

              <v-btn
                text
                class="ma-1"
                @click="
                  dialogPatient = true;
                  dialogPatientData = item;
                "
              >
                <v-icon>mdi-pencil</v-icon> Modifier
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-lazy>
    </section>

    <v-dialog v-model="dialogHistory" width="800" class="pa-0">
      <v-card v-if="dialogPatientData">
        <v-card-title
          class="headline grey lighten-2 d-flex space-between"
          primary-title
        >
          <span class="flex-grow-1">
            {{ dialogPatientData.surname }} {{ dialogPatientData.name }}
          </span>

          <v-btn text icon @click="dialogHistory = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-0">
          <div
            class="flex-grow-1 flex-shrink-1 d-flex flex-nowrap flex-row justify-stretch"
            style="overflow: hidden;"
          >
            <div
              class="scroller flex-grow-1 flex-shrink-1"
              style="max-width: 300px;"
            >
              <v-timeline dense class="pr-4" style="min-height: 100%;">
                <v-timeline-item
                  v-for="(month, i) in months"
                  :key="i"
                  small
                  fill-dot
                >
                  <v-chip
                    :color="
                      currentMonth === month.date + '-01' ? 'primary' : ''
                    "
                    @click="setMonth(month.date)"
                  >
                    {{ month.string }}
                  </v-chip>
                </v-timeline-item>
              </v-timeline>
            </div>
            <div
              class="scroller elevation-1 flex-grow-1 pa-0"
              style="height: 50vh; max-height: 50vh;"
            >
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Date</th>
                      <th class="text-left">Heure</th>
                      <th class="text-left">Chauffeur</th>
                      <th class="text-left">Société</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="course in dialogPatientDataCourses"
                      :key="course.id"
                    >
                      <td>{{ prettyDate(course.date) }}</td>
                      <td>{{ course.time }}</td>
                      <td>
                        <span v-if="course.chauffeur">
                          {{ course.chauffeur.name }}
                        </span>
                      </td>
                      <td>{{ dialogPatientData.societe }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPatient" center width="600">
      <v-card v-if="dialogPatientData" class="pa-2">
        <v-card-title>
          <span>
            {{ dialogPatientData.surname }} {{ dialogPatientData.name }}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogPatient = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card class="mb-2">
          <v-card-text>
            <div class="pa-0 d-flex justify-center align-center">
              <v-text-field
                v-model="dialogPatientData.surname"
                label="Nom"
                hide-details
                :value="dialogPatientData.surname"
                class="ma-2"
                @change="changeSurname($event, dialogPatientData)"
              ></v-text-field>

              <v-text-field
                v-model="dialogPatientData.name"
                label="Prénom"
                hide-details
                :value="dialogPatientData.name"
                class="ma-2"
                @change="changeName($event, dialogPatientData)"
              ></v-text-field>
            </div>

            <div class="pa-0 d-flex justify-center align-center">
              <v-text-field
                v-model="dialogPatientData.telephone"
                label="Téléphone"
                hide-details
                :value="dialogPatientData.telephone"
                class="ma-2"
                @change="changeTelephone($event, dialogPatientData)"
              ></v-text-field>
            </div>

            <v-textarea
              v-model="dialogPatientData.adresse"
              label="Adresse"
              rows="3"
              hide-details
              :value="dialogPatientData.adresse"
              class="ma-2"
              @change="changeAdresse($event, dialogPatientData)"
            ></v-textarea>
          </v-card-text>
        </v-card>

        <div class="d-flex">
          <v-card class="mr-2">
            <v-card-text>
              <div class="pa-0 d-flex justify-center align-center">
                <v-select
                  v-model="dialogPatientData.type"
                  label="Type"
                  :items="types"
                  :value="dialogPatientData.type"
                  hide-details
                  class="ma-2 type"
                  @change="changeType($event, dialogPatientData)"
                >
                  <template v-slot:selection>
                    <div
                      style="display: flex; flex-flow: row nowrap; align-items: center;"
                    >
                      <v-avatar
                        size="24"
                        :style="{
                          backgroundColor: dialogPatientData.color,
                          marginRight: '4px'
                        }"
                        class="white--text"
                      >
                        {{ dialogPatientData.shortType }}
                      </v-avatar>
                      <div>
                        {{ dialogPatientData.type }}
                      </div>
                    </div>
                  </template>
                  <template v-slot:item="{ item: type }">
                    <div
                      style="display: flex; flex-flow: row nowrap; align-items: center;"
                    >
                      <v-avatar
                        :style="{
                          backgroundColor: color(type),
                          marginRight: '4px'
                        }"
                        size="24"
                        class="white--text"
                      >
                        {{ shortType(type) }}
                      </v-avatar>
                      <div>
                        {{ type }}
                      </div>
                    </div>
                  </template>
                </v-select>
              </div>

              <div class="pa-0 d-flex justify-center align-center">
                <v-select
                  v-model="dialogPatientData.place"
                  :items="places"
                  label="Etablissement"
                  hide-details
                  height="24"
                  item-text="name"
                  item-value="id"
                  :value="dialogPatientData.place"
                  class="ma-2"
                  @change="changePlace($event, dialogPatientData)"
                ></v-select>
              </div>

              <div class="pa-0 d-flex justify-center align-center">
                <v-select
                  v-model="dialogPatientData.societe"
                  :items="societes"
                  label="Société"
                  hide-details
                  height="24"
                  :value="dialogPatientData.societe"
                  class="ma-2"
                  @change="changeSociete($event, dialogPatientData)"
                ></v-select>
              </div>
            </v-card-text>
          </v-card>

          <v-card>
            <v-card-text>
              <v-switch
                v-model="dialogPatientData.assistance"
                @change="changeAssistance($event, dialogPatientData)"
                ><template v-slot:label>
                  <v-icon
                    class="mr-1"
                    :color="
                      dialogPatientData.assistance ? 'green darken-2' : ''
                    "
                    >{{ mdiHumanWheelchair }}</v-icon
                  >
                  Requiert de l'assistance
                </template></v-switch
              >
              <v-textarea
                v-model="dialogPatientData.note"
                label="Notes"
                rows="5"
                hide-details
                :value="dialogPatientData.note"
                class="ma-2"
                @change="changeNote($event, dialogPatientData)"
              ></v-textarea>
            </v-card-text>
          </v-card>
        </div>

        <div class="pa-2 d-flex justify-end">
          <v-spacer></v-spacer>
          <span
            v-for="day of days"
            :key="day"
            class="day-label pt-1 flex-grow-0 flex-shrink-0 text-center"
            style="width: 80px;"
          >
            {{ day }}
          </span>
        </div>

        <div
          class="pa-2 patient d-flex justify-end align-center"
          style="overflow:hidden;"
        >
          <div
            style="width:32px;height: 72px;"
            class="d-flex flex-column justify-space-around"
          >
            <v-icon>
              mdi-arrow-right
            </v-icon>
            <v-icon>
              mdi-arrow-left
            </v-icon>
          </div>

          <patient-day-cell
            v-for="day of days"
            :key="day"
            class="flex-grow-0 flex-shrink-0 text-center"
            width="80px"
            :patient="dialogPatientData"
            :day="day"
          ></patient-day-cell>
        </div>
        <v-card-actions>
          <v-btn text color="red" @click="deleteModal(dialogPatientData)">
            <v-icon>mdi-delete-forever</v-icon> Supprimer
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogPatient = false">Valider</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" persistent max-width="290">
      <v-card v-if="deleteData">
        <v-card-title>
          Etes-vous sûrs de vouloir supprimer le patient
          <v-chip> {{ deleteData.surname }} {{ deleteData.name }} </v-chip>
          ?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="
              dialogDelete = false;
              deleteData = undefined;
            "
          >
            Annuler
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="
              deletePatient(deleteData);
              deleteData = undefined;
              dialogDelete = false;
              dialogPatient = false;
            "
          >
            SUPPRIMER
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiHumanWheelchair } from "@mdi/js";
import * as dayjs from "dayjs";
import Patient from "@/models/Patient";
import Place from "@/models/Place";
import PatientDayCell from "@/components/semaine/PatientDayCell.vue";
import Types from "../../database/types";

export default {
  name: "Semaine",
  components: {
    PatientDayCell
  },
  data() {
    return {
      dialog: false,
      dialogPatient: false,
      dialogHistory: false,
      dialogPatientData: undefined,
      newTime: "",
      days: [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche"
      ],
      types: Object.keys(Types),
      searchTerms: "",
      deleteData: undefined,
      dialogDelete: false,
      societes: ["OKA", "Cicciu", "TAP"],
      currentMonth: dayjs().format("YYYY-MM") + "-01",
      mdiHumanWheelchair
    };
  },
  computed: {
    dialogPatientDataCourses() {
      return this.dialogPatientData.courses.filter(course => {
        return dayjs(course.date).isSame(this.currentMonth, "month");
      });
    },
    months() {
      if (this.dialogPatientData) {
        return this.dialogPatientData.courses
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
      }
      return [];
    },
    patients() {
      return Patient.query()
        .where("deleted", "")
        .orderBy("surname", "asc")
        .orderBy("name", "asc")
        .with("place")
        .with("courses")
        .with("courses.chauffeur")
        .get();
    },
    places() {
      return Place.query()
        .orderBy("name")
        .get();
    },
    search() {
      return this.searchTerms.toLowerCase().split(" ");
    },
    filteredPatients() {
      if (this.searchTerms) {
        return this.patients.filter(patient => {
          return this.search.every(s => {
            return `${patient.name} ${patient.surname}`
              .toLowerCase()
              .includes(s);
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
    },
    color(type) {
      return new Patient({ type }).color;
    },
    shortType(type) {
      return new Patient({ type }).shortType;
    },
    cancel() {
      this.dialog = false;
    },
    async addPatient() {
      this.dialogPatientData = await Patient.create();
      this.dialogPatient = true;
    },
    deletePatient(patient) {
      patient.delete();
    },
    changeName($event, patient) {
      patient.update({ name: $event });
    },
    changeSurname($event, patient) {
      patient.update({ surname: $event });
    },
    changeTelephone($event, patient) {
      patient.update({ telephone: $event });
    },
    changeNote($event, patient) {
      patient.update({ note: $event });
    },
    changeAssistance($event, patient) {
      console.log($event);
      patient.update({ assistance: $event });
    },
    changeAdresse($event, patient) {
      patient.update({ adresse: $event });
    },
    changeType($event, patient) {
      patient.update({
        type: $event
      });
    },
    deleteModal(item) {
      this.deleteData = item;
      this.dialogDelete = true;
    },
    changePlace($event, patient) {
      patient.update({ place_id: $event });
    },
    changeSociete($event, patient) {
      patient.update({ societe: $event });
    }
  }
};
</script>

<style scoped lang="scss">
.patient {
  height: 72px;
}
.action-bar {
  z-index: 2;
  position: sticky;
  min-height: 64px;
  top: 0;
  width: 100%;
}
.scroller {
  width: 100%;
  overflow-y: scroll;
}
</style>
