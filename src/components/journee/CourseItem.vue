<template>
  <v-card
    :class="{
      deleted: course.deleted !== '',
      'elevation-0': course.deleted !== ''
    }"
    :style="
      `border-left: solid 82px ${course.color} !important; max-width: 600px;`
    "
  >
    <v-card-text fill-height class="pa-1 pl-4">
      <div class="d-flex justify-space-between align-center nowrap py-0">
        <div class="mr-2 d-flex flex-shrink-0 flex-grow-0" text-center>
          <v-dialog v-model="dialog" width="unset" persistent>
            <template v-slot:activator="{ on }">
              <v-btn
                :disabled="!admin"
                text
                class="time-btn white--text"
                v-on="on"
                @click="newTime = course.time"
              >
                <span :class="`subtitle-1 font-weight-bold`">
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
          <v-select
            v-if="!course.generated"
            :items="types"
            :value="course.type"
            class="mx-2 type combo-width flex-grow-0 flex-shrink-1"
            label="Type"
            dense
            outlined
            hide-details
            @change="changeType($event, course)"
          ></v-select>
          <span
            v-if="course.generated && course.patient"
            class="flex-grow-1"
            :style="{ minWidth: '100px' }"
          >
            {{ course.patient.fullname }}
            <i v-if="course.deleted">Course annulée</i>
            <i v-else-if="course.doneDate">Course effectuée</i>
          </span>
          <v-combobox
            v-else
            dense
            :value="course.patient"
            height="24"
            :items="patients"
            item-text="fullname"
            label="Nom du patient"
            class="combo-width mx-2 flex-shrink-0 flex-grow-0"
            autocomplete="no-fill"
            hide-details
            outlined
            @change="changePatient($event, course)"
          >
          </v-combobox>
        </div>
        <template v-if="admin">
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
                <span>Etes-vous sûrs de vouloir annuler la course ?</span>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="dialogDelete = false"
                >
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
            color="black"
            v-on="on"
            @click="undeleteCourse(course)"
          >
            <v-icon>mdi-restore</v-icon> Restaurer
          </v-btn>
        </template>
      </div>
    </v-card-text>
    <v-card-actions
      v-if="course.time"
      class="d-flex justify-space-between align-center"
    >
      <v-icon v-if="course.direction">
        {{
          course.direction === "Aller"
            ? "mdi-arrow-right"
            : course.direction === "Retour"
            ? "mdi-arrow-left"
            : ""
        }}
      </v-icon>
      <span v-if="course.direction">
        {{
          course.direction === "Aller"
            ? "Aller"
            : course.direction === "Retour"
            ? "Retour"
            : ""
        }}
      </span>
      <v-spacer></v-spacer>
      <v-combobox
        v-if="!hideChauffeur && admin"
        dense
        :value="course.chauffeur"
        height="24"
        :items="chauffeurs"
        item-text="name"
        label="Chauffeur"
        class="combo-width flex-shrink-0 flex-grow-0 mx-2"
        hide-details
        autocomplete="off"
        outlined
        clearable
        @click:clear="changeChauffeur(null, course)"
        @change="changeChauffeur($event, course)"
      ></v-combobox>
      <v-select
        v-if="!hideChauffeur && admin"
        :items="societes"
        label="Société"
        hide-details
        height="24"
        outlined
        :value="course.societe"
        class="combo-width flex-shrink-0 flex-grow-0 mx-2"
        dense
        @change="changeSociete($event, course)"
      ></v-select>
    </v-card-actions>

    <v-card-actions
      v-if="course.time && course.chauffeur && course.societe"
      class="d-flex justify-space-between align-center"
    >
      <v-spacer></v-spacer>
      <v-btn
        text
        :color="!course.doneDate ? 'green' : 'grey'"
        :disabled="!course.chauffeur || !course.time"
        @click="doCourse(course)"
      >
        {{ !course.doneDate ? "Valider" : "Annuler" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
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
      newTime: this.course ? this.course.time : "",
      types: ["Dialyse", "HDJ", "Consultation", "Kiné / Rééducation"],
      societes: ["OKA", "Cicciu", "TAP"]
    };
  },
  computed: {
    ...mapState(["admin"]),
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
      let chauffeur = $event;
      if (typeof chauffeur !== "string") {
        course.update({
          chauffeur_id: $event ? chauffeur.id : null
        });
      }
    },
    changeType($event, course) {
      course.update({
        type: $event
      });
    },
    doCourse(course) {
      if (!course.doneDate) {
        course.done();
      } else {
        course.undone();
      }
    },
    deleteCourse(course) {
      course.delete();
    },
    undeleteCourse(course) {
      course.undelete();
    },
    changeSociete($event, course) {
      course.update({ societe: $event });
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
.time-btn {
  margin-left: -94px;
  margin-right: 16px;
}
</style>
