<template>
  <v-layout>
    <v-flex xs3>
      <v-btn block @click="addPatient()">
        Ajouter patient
      </v-btn>
    </v-flex>
    <v-flex>
      <v-container>
        <v-card>
          <v-simple-table>
            <thead>
              <tr>
                <th></th>
                <th class="text-left">Patient</th>
                <th>Type</th>
                <th v-for="day of days" :key="day">{{ day }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="patient in patients" :key="patient.id">
                <td>
                  <v-avatar
                    :color="patient.color"
                    size="36"
                    class="white--text"
                  >
                    {{ patient.shortType }}
                  </v-avatar>
                </td>
                <td>
                  <v-text-field
                    label="Regular"
                    single-line
                    :value="patient.name"
                    @change="changeName($event, patient)"
                    @blur="commitName(patient)"
                    placeholder="Nom"
                  ></v-text-field>
                </td>
                <td>
                  <v-select
                    :items="types"
                    :value="patient.type"
                    @change="changeType($event, patient)"
                    label="Type"
                    dense
                  ></v-select>
                </td>
                <patient-day-cell
                  :patient="patient"
                  v-for="day of days"
                  :day="day"
                  :key="day"
                />
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import Patient from "@/models/Patient";
import PatientDayCell from "@/components/semaine/PatientDayCell.vue";
import { mapState } from "vuex";
export default {
  name: "Semaine",
  components: {
    PatientDayCell
  },
  computed: {
    patients() {
      return Patient.query()
        .orderBy("name", "asc")
        .get();
    }
  },
  data() {
    return {
      dialog: false,
      newTime: "",
      days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      types: ["Dialyse", "HDJ", "Consultation", "Kiné / Rééducation"]
    };
  },
  methods: {
    cancel() {
      this.dialog = false;
    },
    changeType($event, patient) {
      patient.$update({
        type: $event
      });
    },
    changeName($event, patient) {
      patient.name = $event;
    },
    commitName(patient) {
      patient.$save();
    },
    addPatient() {
      let patient = new Patient();
      patient.$save();
    }
  }
};
</script>

<style scoped lang="scss">
</style>
