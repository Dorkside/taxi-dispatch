<template>
  <v-card>
    <v-card-text fill-height class="pa-0 px-4">
      <v-layout fill-height row justify-center align-center>
        <v-flex mr-2 shrink text-center>
          <v-dialog v-model="dialog" width="unset" persistent>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on" @click="newTime = course.time">
                <span
                  :class="`subtitle-1 font-weight-bold ${course.color}--text`"
                >
                  {{ course.prettyTime }}
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
                <v-spacer></v-spacer>

                <v-btn align-end color="orange" text @click="cancel()">
                  Annuler
                </v-btn>
                <v-btn align-end color="green" text @click="changeTime()">
                  Valider
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
        <v-flex v-if="course.generated">
          <span>
            {{ course.patient.name }}
          </span>
        </v-flex>
        <v-flex v-else>
          <v-combobox
            dense
            :value="course.patient"
            height="24"
            @change="changePatient($event, course)"
            :items="patients"
            item-text="name"
            label="Nom du patient"
            class="mx-2"
            autocomplete="off"
          ></v-combobox>
        </v-flex>
        <v-flex>
          <v-combobox
            dense
            :value="course.chauffeur"
            height="24"
            @change="changeChauffeur($event, course)"
            :items="chauffeurs"
            item-text="name"
            label="Chauffeur"
            class="mx-2"
            autocomplete="off"
          ></v-combobox>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>


<script>
import Patient from "@/models/Patient";
import Course from "@/models/Course";
import Chauffeur from "@/models/Chauffeur";
export default {
  name: "CourseItem",
  props: {
    course: { type: Object },
    index: { type: Number }
  },
  data() {
    return {
      dialog: false,
      newTime: this.course ? this.course.time : ""
    };
  },
  methods: {
    cancel() {
      this.dialog = false;
    },
    changeTime() {
      this.course.$update({
        time: this.newTime
      });
      this.dialog = false;
    },
    async changePatient($event, course) {
      if ($event) {
        let patient = $event;
        if (typeof patient === "string") {
          patient = await Patient.insert({
            name: patient
          });
        }
        course.$update({
          patient_id: patient.id
        });
      }
    },
    changeChauffeur($event, course) {
      if ($event) {
        let chauffeur = $event;
        if (typeof chauffeur !== "string") {
          course.$update({
            chauffeur_id: chauffeur.id
          });
        }
      }
    }
  },
  computed: {
    patients() {
      return Patient.query().get();
    },
    chauffeurs() {
      return Chauffeur.query().get();
    }
  }
};
</script>

<style scoped lang="scss">
.full-width {
  width: 100%;
}
.thin-card {
  height: 48px;
  * {
    max-height: 48px;
  }
}
</style>