<template>
  <v-lazy :min-height="lazySize" class="col-12 pa-0">
    <v-card
      class="mx-auto pa-0"
      :style="
        `border-left: solid 82px ${
          course.color
        } !important; max-width: 600px; opacity: ${
          course.transportRecupere &&
          course.transportControle &&
          course.passageRecupere &&
          course.passageControle
            ? 0.5
            : 1
        }`
      "
    >
      <v-chip
        v-if="course.patient && !preventUpdate && admin"
        class="elevation-0"
        :color="course.patient.societe ? 'yellow' : 'red'"
        style="position:absolute; right: 0px; top: 0px; border-radius: 0 4px 0 12px;"
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
            <v-btn disabled text class="time-btn white--text">
              <span :class="`subtitle-1 font-weight-bold`">
                {{ course.prettyTime }}
              </span>
            </v-btn>
            <div v-if="course.patient" class="d-flex flex-column col-12 pa-0">
              <div class="d-flex flex-row align-center justify-start my-2">
                <h3 class="flex-grow-0 mb-0" :style="{ minWidth: '100px' }">
                  {{ course.patient.fullname }}
                  <small v-if="course.patient.deleted"
                    >(Patient supprimé)</small
                  >
                </h3>
                <v-spacer />
              </div>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-chip
        pill
        class="elevation-0"
        style="position: absolute; left: -82px; bottom: 0px; border-radius: 0 12px 0 4px; border-top: solid 1px #e0e0e0; border-right: solid 1px #e0e0e0;"
      >
        <v-avatar
          left
          style="color:white; border-radius: 0;"
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
        </span>
      </v-chip>

      <v-card-actions class="d-flex justify-space-between align-center pa-0">
        <v-spacer></v-spacer>
        <h4 class="mx-2">Bon de transport</h4>
        <div class="d-flex flex-wrap">
          <v-checkbox
            :input-value="course.transportRecupere"
            color="blue"
            label="Récupéré"
            class="ma-1"
            hide-details
            @click="course.recupererTransport(!course.transportRecupere)"
          />
          <v-checkbox
            :input-value="course.transportControle"
            color="blue"
            label="Contrôlé"
            class="ma-1"
            hide-details
            :style="{ opacity: course.transportRecupere ? 1 : 0.5 }"
            @click="course.controlerTransport(!course.transportControle)"
          />
        </div>
      </v-card-actions>
      <v-card-actions class="d-flex justify-space-between align-center pa-0">
        <v-spacer></v-spacer>
        <h4 class="mx-2">Bon de passage</h4>
        <div class="d-flex flex-wrap">
          <v-checkbox
            :input-value="course.passageRecupere"
            color="blue"
            label="Récupéré"
            class="ma-1"
            hide-details
            @click="course.recupererPassage(!course.passageRecupere)"
          />
          <v-checkbox
            :input-value="course.passageControle"
            color="blue"
            label="Contrôlé"
            class="ma-1"
            hide-details
            :style="{ opacity: course.passageRecupere ? 1 : 0.5 }"
            @click="course.controlerPassage(!course.passageControle)"
          />
        </div>
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
  name: "BonsItem",
  props: {
    course: { type: Object, default: undefined },
    hideChauffeur: { type: Boolean, default: false },
    preventUpdate: { type: Boolean, default: false },
    lazySize: { type: Number, default: 118 }
  },
  data() {
    return {
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
  methods: {}
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
