<template>
  <v-card class="full-width" :style="{ backgroundColor: course.color }">
    <v-card-text fill-height class="pa-2 px-4 full-width">
      <div class="d-flex flex-row justify-center align-center pa-0">
        <v-icon dark>
          {{
            course.direction === "Aller"
              ? "mdi-arrow-right"
              : course.direction === "Retour"
              ? "mdi-arrow-left"
              : ""
          }}
        </v-icon>
        <span
          class="mr-2 flex-shrink-1 flex-grow-0"
          :class="`subtitle-1 font-weight-bold white--text`"
        >
          {{ course.prettyTime }}
        </span>
        <span v-if="course.patient" class="flex-grow-1 text-wrap white--text">
          {{ course.patient.name }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import Patient from "@/models/Patient";
import Course from "@/models/Course";
import Chauffeur from "@/models/Chauffeur";
export default {
  name: "DepartItem",
  props: {
    course: { type: Object, default: undefined },
    index: { type: Number, default: undefined }
  },
  data() {
    return {
      dialog: false,
      newTime: this.course ? this.course.time : ""
    };
  },
  methods: {
    changeChauffeur($event, course) {
      if ($event) {
        let chauffeur = $event;
        if (typeof chauffeur !== "string") {
          course.update({
            chauffeur_id: chauffeur.id
          });
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.full-width {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}
.thin-card {
  height: 48px;
  * {
    max-height: 48px;
  }
}
.nowrap {
  flex-flow: nowrap;
}
.text-wrap {
  overflow: hidden;
}
</style>
