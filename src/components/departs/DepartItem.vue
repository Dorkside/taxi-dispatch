<template>
  <v-lazy
    min-height="36"
    style="width: 100%; max-width: 100%;"
    :style="
      compact && {
        maxWidth: isClicked ? '200px' : `${3 * 26 - 4}px`,
        minHeight: '60px',
        position: 'absolute',
        top: isDragging ? '8px' : `${8 + 88 * course.overlap}px`,
        left: `${leftOffset}px`,
        zIndex: isClicked ? 10 : 0
      }
    "
  >
    <v-card
      class="full-width"
      style="overflow:visible; position: relative;"
      :style="{
        borderLeft:
          !compact || isClicked ? `solid 54px ${course.color}` : 'none'
      }"
      @click.stop="clickCourse(course)"
    >
      <v-card-text class="pa-1 full-width" style="overflow:visible;">
        <div class="d-flex flex-row justify-center align-center pa-0">
          <span
            v-if="!compact || isClicked"
            class="time-span mr-1 flex-shrink-0 flex-grow-0 subtitle-1 font-weight-bold white--text"
          >
            {{ course.prettyTime }}
          </span>
          <v-icon
            v-if="!compact || isClicked"
            class="flex-shrink-0 flex-grow-0"
            x-small
            style="position: absolute; left: 0; bottom: 0;"
          >
            {{
              course.direction === "Aller"
                ? "mdi-arrow-right"
                : course.direction === "Retour"
                ? "mdi-arrow-left"
                : ""
            }}
          </v-icon>
          <div class="flex-grow-1 text-wrap ml-2">
            <span v-if="course.patient">
              {{ course.patient.name }}
              <br v-if="compact" />
              {{ course.patient.surname }}
            </span>
            <span v-else>
              <i>NA</i>
            </span>
          </div>
          <v-icon v-if="!compact" class="flex-shrink-0 flex-grow-0 handle">
            mdi-drag
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
    index: { type: Number, default: undefined },
    compact: { type: Boolean, default: false },
    isDragging: { type: Boolean, default: false },
    isClicked: { type: Boolean, default: false },
    leftOffset: { type: Number, default: 0 },
    topOffset: { type: Number, default: 0 }
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
    },
    clickCourse(course) {
      this.$emit("clicked", course.id);
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
  margin-left: -52px;
  margin-right: 32px;
}
</style>
