<template>
  <v-lazy min-height="100" class="col-12 pa-0">
    <v-card
      class="my-2 mx-auto"
      :style="
        `border-left: solid 82px ${course.color} !important; max-width: 600px;`
      "
    >
      <v-chip
        v-if="course.patient && !preventUpdate && admin"
        class="elevation-2"
        :color="course.patient.societe ? 'yellow' : 'red'"
        style="position:absolute; right: -16px; top: -16px;"
        small
      >
        {{ (course.patient && course.patient.societe) || "Aucune société" }}
      </v-chip>
      <v-card-text fill-height class="pa-1 pl-4">
        <div
          class="d-flex justify-space-between align-center nowrap py-0 px-1 col-12"
        >
          <div
            class="mr-2 d-flex flex-shrink-0 flex-grow-0 col-12 pa-0"
            text-center
          >
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
            <div class="d-flex flex-column col-12 pa-0">
              <div class="d-flex flex-row mb-2">
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
                <v-combobox
                  v-if="!course.generated"
                  dense
                  :value="course.patient"
                  height="24"
                  :items="patients"
                  item-text="fullname"
                  label="Patient"
                  class="combo-width mx-2 flex-shrink-0 flex-grow-0"
                  autocomplete="no-fill"
                  hide-details
                  outlined
                  @change="changePatient($event, course)"
                >
                </v-combobox>
              </div>
              <div class="d-flex flex-row mb-2">
                <h3
                  v-if="course.generated && course.patient"
                  class="flex-grow-1 mb-0"
                  :style="{ minWidth: '100px' }"
                >
                  {{ course.patient.fullname }}
                  <small v-if="course.patient.deleted"
                    >(Patient supprimé)</small
                  >
                </h3>

                <a
                  v-if="course.patient.telephone"
                  class="no-link"
                  :href="`tel:${course.patient.telephone}`"
                >
                  <v-chip class="ml-4 mb-1" :style="{ minWidth: '100px' }">
                    <v-icon>mdi-phone</v-icon>
                    {{ course.patient.telephone || "???" }}
                  </v-chip>
                </a>
              </div>

              <div v-if="course.patient.note" class="d-flex flex-column">
                <small><i>Notes</i></small>
                <span>{{ course.patient.note }}</span>
              </div>

              <div
                class="d-flex col-12 pa-0 flex-grow-0 flex-shrink-1"
                :class="{
                  'flex-column': course.direction === 'Aller',
                  'flex-column-reverse': course.direction === 'Retour'
                }"
              >
                <v-chip
                  v-if="course.patient"
                  class="wrap-span"
                  :style="{
                    minWidth: '100px',
                    maxWidth: '100%',
                    height: 'auto'
                  }"
                  @click="openMap(course.patient.adresse)"
                >
                  <v-icon>mdi-home-map-marker</v-icon>
                  <span class="flex-1">
                    {{ course.patient.adresse || "???" }}
                  </span>
                </v-chip>
                <div class="pointilles"></div>
                <v-chip
                  v-if="course.patient && course.patient.place"
                  class="wrap-span d-flex"
                  :style="{
                    minWidth: '100px',
                    maxWidth: '100%',
                    height: 'auto'
                  }"
                  @click="openMap(course.patient.place.adresse)"
                >
                  <v-icon>mdi-hospital-marker</v-icon>
                  <span class="flex-1">
                    {{ course.patient.place.name }},
                    {{ course.patient.place.adresse || "???" }}
                  </span>
                </v-chip>
              </div>
            </div>
          </div>
          <template v-if="admin">
            <v-dialog
              v-if="course.deleted === ''"
              v-model="dialogDelete"
              persistent
              max-width="290"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="!preventUpdate && !course.doneDate"
                  text
                  icon
                  color="red"
                  v-on="on"
                >
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

            <v-btn v-else text color="black" @click="undeleteCourse(course)">
              <v-icon>mdi-restore</v-icon> Restaurer
            </v-btn>
          </template>
        </div>
      </v-card-text>

      <v-chip
        pill
        class="elevation-2"
        style="position: absolute; left: -100px; bottom: -16px;"
      >
        <v-avatar
          left
          style="color:white;"
          :style="{ backgroundColor: course.color }"
        >
          {{ course.shortType }}
        </v-avatar>
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
          {{
            course.patient && course.patient.place && course.patient.place.name
              ? `&nbsp;|&nbsp;${course.patient.place.name}`
              : ""
          }}
        </span>
      </v-chip>

      <v-card-actions class="d-flex justify-space-between align-center">
        <v-spacer></v-spacer>
        <v-icon
          v-if="admin"
          class="mr-2"
          :color="course.isRead ? 'green' : 'grey'"
        >
          {{ course.isRead ? "mdi-eye-check" : "mdi-eye-off" }}
        </v-icon>
        <v-combobox
          v-if="
            course.time &&
              !hideChauffeur &&
              admin &&
              !course.doneDate &&
              !course.deleted
          "
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
        <slot name="actions"></slot>
      </v-card-actions>

      <v-card-actions
        v-if="course.time && !course.deleted"
        class="d-flex justify-space-between align-center"
      >
        <v-spacer></v-spacer>
        <v-btn
          v-if="admin && course.chauffeur"
          text
          :color="!course.doneDate ? 'green' : 'grey'"
          :disabled="!course.chauffeur || !course.time"
          @click="doCourse(course)"
        >
          {{ !course.doneDate ? "Valider" : "Annuler" }}
        </v-btn>
        <v-btn
          v-if="!admin"
          :disabled="course.isRead"
          small
          outlined
          color="green"
          @click="viewCourse(course)"
        >
          <v-icon class="mr-2">mdi-eye-check</v-icon>
          {{ course.isRead ? "Vu" : "Marquer comme vu" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-lazy>
</template>

<script>
import { mapState } from "vuex";
import Patient from "@/models/Patient";
import Chauffeur from "@/models/Chauffeur";
import Types from "../../database/types";

export default {
  name: "CourseItem",
  props: {
    course: { type: Object, default: undefined },
    hideChauffeur: { type: Boolean, default: false },
    preventUpdate: { type: Boolean, default: false }
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      newTime: this.course ? this.course.time : "",
      types: Object.keys(Types),
      societes: ["OKA", "Cicciu", "TAP"]
    };
  },
  computed: {
    ...mapState(["admin"]),
    patients() {
      return Patient.query()
        .with("place")
        .get();
    },
    chauffeurs() {
      return Chauffeur.query()
        .where("deleted", "")
        .get();
    }
  },
  methods: {
    openMap(adresse) {
      if (
        /* if we're on iOS, open in Apple Maps */
        navigator.platform.indexOf("iPhone") != -1 ||
        navigator.platform.indexOf("iPad") != -1 ||
        navigator.platform.indexOf("iPod") != -1
      ) {
        window.open(`maps://maps.google.com/maps?daddr=${adresse}&amp;ll=`);
      } else {
        window.open(`https://maps.google.com/maps?daddr=${adresse}&amp;ll=`);
      }
    },
    cancel() {
      this.dialog = false;
    },
    changeTime() {
      if (!this.preventUpdate) {
        this.course.update({
          time: this.newTime,
          isRead: false
        });
      } else {
        this.course.time = this.newTime;
      }
      this.dialog = false;
    },
    async changePatient($event, course) {
      if ($event) {
        let patient = $event;
        if (typeof patient === "string") {
          patient = await Patient.insert({
            name: patient,
            isRead: false
          });
        }
        if (!this.preventUpdate) {
          course.update({
            patient_id: patient.id,
            isRead: false
          });
        } else {
          course.patient = patient;
          course.patient_id = patient.id;
        }
      }
    },
    changeChauffeur($event, course) {
      let chauffeur = $event;
      if (typeof chauffeur !== "string") {
        course.update({
          chauffeur_id: $event ? chauffeur.id : null,
          isRead: false
        });
      }
    },
    changeType($event, course) {
      if (!this.preventUpdate) {
        course.update({
          type: $event,
          isRead: false
        });
      } else {
        course.type = $event;
      }
    },
    doCourse(course) {
      if (!course.doneDate) {
        course.done();
      } else {
        course.undone();
      }
    },
    viewCourse(course) {
      if (!course.isRead) {
        course.read();
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
.no-link {
  text-decoration: none;
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
::v-deep .wrap-span > span.v-chip__content {
  white-space: initial;
}
.pointilles {
  min-height: 16px;
  border-left: dotted 4px black;
  margin-left: 22px;
}
.waze-icon {
  position: absolute;
  opacity: 0.5;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
