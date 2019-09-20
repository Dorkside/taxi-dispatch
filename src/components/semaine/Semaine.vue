<template>
  <v-container class="pa-0 ma-0 z-index-8 ">
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
      types: ["Dialyse", "HDJ", "Consultation", "Kiné / Rééducation"]
    };
  },
  computed: {
    patients() {
      return Patient.query()
        .orderBy("name", "asc")
        .get();
    }
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

<style scoped lang="scss"></style>
