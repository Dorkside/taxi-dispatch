<template>
  <v-timeline-item :color="course.patient.color" small fill-dot>
    <v-layout row justify-center align-center>
      <v-flex mr-4 shrink text-center>
        <v-dialog v-model="dialog" width="unset" persistent>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on" @click="newTime = course.time">
              <span
                :class="
                  `subtitle-1 font-weight-bold ${course.patient.color}--text`
                "
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
          <v-card-title text-right class="subtitle-2">
            {{ course.patient.name }}
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-timeline-item>
</template>


<script>
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
    }
  }
};
</script>