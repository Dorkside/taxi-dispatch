<template>
  <v-card>
    <v-card-text fill-height class="pa-2 px-4">
      <v-layout fill-height row justify-center align-center>
        <v-flex mr-2 shrink text-center>
          <span :class="`subtitle-1 font-weight-bold ${course.color}--text`">
            {{ course.prettyTime }}
          </span>
        </v-flex>
        <v-flex>
          <span v-if="course.patient">
            {{ course.patient.name }}
          </span>
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
}
.thin-card {
  height: 48px;
  * {
    max-height: 48px;
  }
}
</style>
