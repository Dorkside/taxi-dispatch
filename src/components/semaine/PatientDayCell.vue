<template>
  <td class="pa-1 text-center">
    <v-dialog v-model="dialog" width="unset" persistent>
      <template v-slot:activator="{ on }">
        <v-btn
          text
          v-on="on"
          @click="
            newTime = patient[day.toLowerCase()];
            r = false;
          "
        >
          <span class="font-weight-bold">
            {{ patient.prettyTime(day) }}
          </span>
        </v-btn>
        <v-btn
          text
          v-on="on"
          @click="
            newTime = patient[day.toLowerCase() + 'Retour'];
            r = true;
          "
        >
          <span class="font-weight-bold">
            {{ patient.prettyTime(day, true) }}
          </span>
        </v-btn>
      </template>
      <v-card>
        <v-time-picker
          v-if="dialog"
          v-model="newTime"
          landscape
          format="24hr"
          @change="changeTime"
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
    patient: { type: Object, default: undefined },
    day: { type: String, default: undefined }
  },
  data() {
    return {
      dialog: false,
      newTime: this.patient[this.day.toLowerCase()],
      r: false
    };
  },
  watch: {
    newTime() {
      this.patient[
        this.day.toLowerCase() + (this.r ? "Retour" : "")
      ] = this.newTime;
    }
  },
  methods: {
    async remove() {
      this.newTime = "";
      await this.patient.update({
        [this.day.toLowerCase() + (this.r ? "Retour" : "")]: ""
      });
      this.dialog = false;
    },
    cancel() {
      this.dialog = false;
    },
    async changeTime() {
      await this.patient.update({
        [this.day.toLowerCase() + (this.r ? "Retour" : "")]: this.newTime
      });
      this.dialog = false;
    }
  }
};
</script>
<style lang="scss" scoped></style>
