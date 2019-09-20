<template>
  <td>
    <v-dialog v-model="dialog" width="unset" persistent>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on" @click="newTime = patient[day.toLowerCase()]">
          <span :class="`subtitle-1 font-weight-bold ${patient.color}--text`">
            <v-icon>mdi-arrow-right</v-icon> {{ patient.prettyTime(day) }}
          </span>
        </v-btn>
        <v-btn text v-on="on" @click="newTime = patient[day.toLowerCase()]">
          <span :class="`subtitle-1 font-weight-bold ${patient.color}--text`">
            <v-icon>mdi-arrow-left</v-icon> {{ patient.prettyTime(day) }}
          </span>
        </v-btn>
      </template>
      <v-card>
        <v-time-picker
          v-if="dialog"
          v-model="newTime"
          landscape
          format="24hr"
        ></v-time-picker>
        <v-card-actions>
          <v-btn color="red" text @click="remove()">
            Supprimer
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn color="orange" text @click="cancel()">
            Annuler
          </v-btn>
          <v-btn color="green" text @click="changeTime()">
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </td>
</template>

<script>
export default {
  name: "PatientDayCell",
  props: {
    patient: { type: Object },
    day: { type: String }
  },
  data() {
    return {
      dialog: false,
      newTime: this.patient[this.day.toLowerCase()]
    };
  },
  methods: {
    remove() {
      this.patient.$update({
        [this.day.toLowerCase()]: ""
      });
      this.dialog = false;
    },
    cancel() {
      this.dialog = false;
    },
    changeTime() {
      this.patient.$update({
        [this.day.toLowerCase()]: this.newTime
      });
      this.dialog = false;
    }
  }
};
</script>
