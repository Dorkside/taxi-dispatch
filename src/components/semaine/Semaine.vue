<template>
  <v-container
    class="d-flex flex-column pa-0 ma-0 z-index-8 scroll align-start"
    fluid
    fill-height
  >
    <div
      class="d-flex blue accent-1 action-bar py-0 px-4 elevation-2 pa-0 align-center"
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
    <v-simple-table dense class="flex-grow-1">
      <thead>
        <tr>
          <th width="50px"></th>
          <th class="text-left">Patient</th>
          <th width="200px">Type</th>
          <th v-for="day of days" :key="day" width="60px">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient in filteredPatients" :key="patient.id">
          <td>
            <v-avatar :color="patient.color" size="36" class="white--text">
              {{ patient.shortType }}
            </v-avatar>
          </td>
          <td>
            <span> {{ patient.name }}</span>
          </td>
          <td>
            <v-select
              :items="types"
              :value="patient.type"
              label="Type"
              dense
              @change="changeType($event, patient)"
            ></v-select>
          </td>
          <patient-day-cell
            v-for="day of days"
            :key="day"
            :patient="patient"
            :day="day"
          />
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
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
      newTime: "",
      days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      types: ["Dialyse", "HDJ", "Consultation", "Kiné / Rééducation"],
      searchTerms: ""
    };
  },
  computed: {
    patients() {
      return Patient.query()
        .orderBy("name", "asc")
        .get();
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
    cancel() {
      this.dialog = false;
    },
    changeType($event, patient) {
      patient.update({
        type: $event
      });
    },
    addPatient() {
      Patient.create();
    }
  }
};
</script>

<style scoped lang="scss">
.scroll {
  overflow-y: auto;
}
.action-bar {
  z-index: 2;
  position: sticky;
  top: 0;
  width: 100%;
}
</style>
