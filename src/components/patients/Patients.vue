<template>
  <v-container class="d-flex flex-column pa-0" fluid>
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
    <v-simple-table class="flex-grow-1">
      <thead>
        <tr>
          <th class="text-left">Patient</th>
          <th width="200px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient of filteredPatients" :key="patient.id">
          <td>
            <v-text-field
              label="Regular"
              single-line
              :value="patient.name"
              placeholder="Nom"
              @change="changeName($event, patient)"
            ></v-text-field>
          </td>
          <td>
            <v-btn text outlined color="red" @click="deletePatient(patient)">
              <v-icon>mdi-delete-forever</v-icon> Supprimer
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>

<script>
import Patient from "@/models/Patient";
export default {
  name: "Patients",
  data() {
    return {
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
    changeName($event, patient) {
      patient.update({ name: $event });
    },
    deletePatient(patient) {
      patient.delete();
    },
    addPatient() {
      Patient.create();
    }
  }
};
</script>

<style scoped lang="scss">
.action-bar {
  z-index: 2;
  position: sticky;
  top: 0;
}
</style>
