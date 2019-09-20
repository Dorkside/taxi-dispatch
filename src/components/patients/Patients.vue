<template>
  <v-simple-table>
    <thead>
      <tr>
        <th class="text-left">Patient</th>
        <th>
          <v-btn @click="addPatient()">
            <v-icon>mdi-plus-circle</v-icon> Ajouter patient
          </v-btn>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="patient of patients" :key="patient.id">
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
</template>

<script>
import Patient from "@/models/Patient";
export default {
  name: "Patients",
  computed: {
    patients() {
      return Patient.query()
        .orderBy("name", "asc")
        .get();
    }
  },
  methods: {
    changeName($event, patient) {
      Patient.$update({
        params: {
          id: patient.id
        },
        data: {
          fields: {
            name: { stringValue: $event }
          }
        }
      });
    },
    deletePatient(patient) {
      Patient.$delete({
        params: {
          id: patient.id
        }
      });
      patient.$delete();
    },
    addPatient() {
      Patient.new();
    }
  }
};
</script>

<style scoped lang="scss"></style>
