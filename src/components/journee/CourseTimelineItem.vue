<template>
  <v-timeline-item :color="course.color" small fill-dot>
    <v-layout row justify-center align-center>
      <v-flex mr-4 shrink text-center>
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
      <v-flex>
        <v-card>
          <v-card-text>
            <v-layout row>
              <v-flex>
                <v-combobox
                  :value="course.patient"
                  @change="changePatient($event, course)"
                  :items="patients"
                  item-text="name"
                  label="Nom du patient"
                ></v-combobox>
              </v-flex>
              <v-flex>
                <v-combobox
                  :value="course.chauffeur"
                  @change="changeChauffeur($event, course)"
                  :items="chauffeurs"
                  item-text="name"
                  label="Chauffeur"
                ></v-combobox>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-timeline-item>
</template>


<script>
import Patient from "@/models/Patient";
import Chauffeur from "@/models/Chauffeur";
export default {
  name: "CourseTimelineItem",
  props: {
    course: { type: Object },
    index: { type: Number }
  },
  data() {
    return {
      dialog: false,
      newTime: this.course.time
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
    changePatient($event, course) {
      if ($event) {
        let patient = $event;
        if (typeof patient === "string") {
          patient = new Patient({ name: patient });
          patient.$save();
        }
        course.patient = patient;
        course.$save();
      }
    },
    changeChauffeur($event, course) {
      if ($event) {
        let chauffeur = $event;
        if (typeof chauffeur !== "string") {
          course.chauffeur = chauffeur;
          course.$save();
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