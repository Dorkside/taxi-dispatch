<template>
  <v-card
    :class="{
      deleted: course.deleted !== '',
      'elevation-0': course.deleted !== ''
    }"
  >
    <v-card-text fill-height class="pa-0 pl-4">
      <v-container
        fill-height
        row
        class="d-flex justify-center align-center nowrap pa-0"
      >
        <div class="mr-2 flex-shrink-0 flex-grow-0" text-center>
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
        </div>
        <span v-if="course.generated" class="flex-grow-1">
          {{ course.patient.name }}
        </span>
        <v-combobox
          v-else
          dense
          :value="course.patient"
          height="24"
          :items="patients"
          item-text="name"
          label="Nom du patient"
          class="flex-grow-1 mx-2"
          autocomplete="no-fill"
          @change="changePatient($event, course)"
        ></v-combobox>
        <v-combobox
          v-if="!hideChauffeur"
          dense
          :value="course.chauffeur"
          height="24"
          :items="chauffeurs"
          item-text="name"
          label="Chauffeur"
          class="combo-width flex-shrink-0 flex-grow-0 mx-2"
          autocomplete="off"
          @change="changeChauffeur($event, course)"
        ></v-combobox>

        <v-dialog
          v-if="course.deleted === ''"
          v-model="dialogDelete"
          persistent
          max-width="290"
        >
          <template v-slot:activator="{ on }">
            <v-btn text icon color="red" v-on="on">
              <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">
              Etes-vous sûrs de vouloir supprimer la course ?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialogDelete = false">
                Annuler
              </v-btn>
              <v-btn
                color="green darken-1"
                text
                @click="
                  deleteCourse(course);
                  dialogDelete = false;
                "
              >
                Confirmer
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-btn
          v-else
          text
          icon
          color="green"
          v-on="on"
          @click="undeleteCourse(course)"
        >
          <v-icon>mdi-restore</v-icon>
        </v-btn>
      </v-container>
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
    course: { type: Object, default: undefined },
    index: { type: Number, default: undefined },
    hideChauffeur: { type: Boolean, default: false }
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      newTime: this.course ? this.course.time : ""
    };
  },
  computed: {
    patients() {
      return Patient.query().get();
    },
    chauffeurs() {
      return Chauffeur.query().get();
    }
  },
  methods: {
    cancel() {
      this.dialog = false;
    },
    changeTime() {
      this.course.update({
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
        course.update({
          patient_id: patient.id
        });
      }
    },
    changeChauffeur($event, course) {
      if ($event) {
        let chauffeur = $event;
        if (typeof chauffeur !== "string") {
          course.update({
            chauffeur_id: chauffeur.id
          });
        }
      }
    },
    deleteCourse(course) {
      course.delete();
    },
    undeleteCourse(course) {
      course.undelete();
    }
  }
};
</script>

<style scoped lang="scss">
.deleted {
  opacity: 0.3;
}
.full-width {
  width: 100%;
}
.thin-card {
  height: 48px;
  * {
    max-height: 48px;
  }
}
.combo-width {
  width: 150px;
}
.nowrap {
  flex-flow: nowrap;
}
</style>
