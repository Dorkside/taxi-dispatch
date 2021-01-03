<template>
  <v-lazy min-height="44">
    <v-card
      class="full-width"
      :style="
        `border-left: solid 82px ${course.color} !important; overflow:visible;`
      "
    >
      <v-card-text class="pa-2 full-width" style="overflow:visible;">
        <div class="d-flex flex-row justify-center align-center pa-0">
          <span
            class="time-span mr-2 flex-shrink-0 flex-grow-0 subtitle-1 font-weight-bold white--text"
          >
            {{ course.prettyTime }}
          </span>
          <v-icon class="ml-1 flex-shrink-0 flex-grow-0">
            {{
              course.direction === "Aller"
                ? "mdi-arrow-right"
                : course.direction === "Retour"
                ? "mdi-arrow-left"
                : ""
            }}
          </v-icon>
          <div class="flex-grow-1 text-wrap">
            <span v-if="course.patient">
              {{ course.patient.name }} {{ course.patient.surname }}
            </span>
            <span v-else>
              <i>NA</i>
            </span>
          </div>
          <v-icon class="flex-shrink-0 flex-grow-0 handle">
            {{ "mdi-arrow-all" }}
          </v-icon>
        </div>
      </v-card-text>
    </v-card>
  </v-lazy>
</template>

<script>
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
            chauffeur_id: chauffeur.id,
            isRead: false
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
  min-width: 0;
  flex: 1;
  span {
    display: block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.time-span {
  margin-left: -64px;
  margin-right: 32px;
}
</style>
