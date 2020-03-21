<template>
  <div
    class="d-flex flex-column pa-0 ma-0 z-index-8 align-start"
    :style="{ height: '100%' }"
  >
    <div
      class="d-flex blue accent-1 action-bar py-0 px-4 elevation-2 pa-0 align-center flex-grow-0 flex-shrink-0"
    >
      <v-text-field
        v-model="searchTerms"
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

    <section class="scroller d-flex flex-wrap">
      <v-card
        v-for="item in filteredPatients"
        :key="item.id"
        class="ma-4"
        style="width: 250px;"
      >
        <div
          style="display: flex; flex-flow: row nowrap; align-items: center; min-width: 200px;"
          class="py-6 px-4"
        >
          <v-chip style="position: absolute; left: -16px; bottom: -12px;">
            <v-avatar
              size="24"
              left
              :style="{ backgroundColor: item.color, marginRight: '4px' }"
              class="white--text"
            >
              {{ item.shortType }}
            </v-avatar>
            {{ item.type }}
          </v-chip>

          <v-chip
            v-if="item"
            class="elevation-2"
            style="position:absolute; right: -16px; top: -12px;"
          >
            {{ item.societe || "Aucune société" }}
          </v-chip>
          <span class="flex-grow-1">{{ item.surname }} {{ item.name }}</span>
          <v-btn
            icon
            @click="
              dialogPatient = true;
              dialogPatientData = item;
            "
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </div>
      </v-card>
    </section>

    <v-dialog v-model="dialogPatient" center width="600">
      <v-card v-if="dialogPatientData" class="pa-2">
        <v-card-title>
          <span>
            {{ dialogPatientData.surname }} {{ dialogPatientData.name }}
          </span>
          <v-spacer></v-spacer>
          <v-btn text color="red" @click="deleteModal(dialogPatientData)">
            <v-icon>mdi-delete-forever</v-icon> Supprimer
          </v-btn>
        </v-card-title>
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

        <div class="pa-2 d-flex justify-end">
          <b>Horaires</b>
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
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" persistent max-width="290">
      <v-card v-if="deleteData">
        Etes-vous sûrs de vouloir supprimer le patient
        {{ deleteData.surname }} {{ deleteData.name }} ?
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
            color="green darken-1"
            text
            @click="
              deletePatient(deleteData);
              deleteData = undefined;
              dialogDelete = false;
              dialogPatient = false;
            "
          >
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Patient from "@/models/Patient";
import PatientDayCell from "@/components/semaine/PatientDayCell.vue";
export default {
  name: "Semaine",
  components: {
    PatientDayCell
  },
  data() {
    return {
      dialog: false,
      dialogPatient: false,
      dialogPatientData: undefined,
      newTime: "",
      days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      types: [
        "Dialyse",
        "HDJ",
        "Consultation",
        "Kiné / Rééducation",
        "Chimiothérapie",
        "Sortie d'hôpital"
      ],
      searchTerms: "",
      deleteData: undefined,
      dialogDelete: false,
      societes: ["OKA", "Cicciu", "TAP"]
    };
  },
  computed: {
    patients() {
      return Patient.query()
        .orderBy("surname", "asc")
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
    color(type) {
      return new Patient({ type }).color;
    },
    shortType(type) {
      return new Patient({ type }).shortType;
    },
    cancel() {
      this.dialog = false;
    },
    addPatient() {
      Patient.create();
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
    changeType($event, patient) {
      patient.update({
        type: $event
      });
    },
    deleteModal(item) {
      this.deleteData = item;
      this.dialogDelete = true;
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
.scroll {
  overflow-y: scroll;
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
}
</style>
