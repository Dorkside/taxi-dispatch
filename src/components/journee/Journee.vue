<template>
  <v-timeline dense>
    <course-timeline-item
      v-for="(course, index) in coursesToday"
      :key="index"
      :course="course"
      :index="index"
    ></course-timeline-item>
  </v-timeline>
</template>

<script>
import Course from "@/models/Course";
import CourseTimelineItem from "./CourseTimelineItem";
import { mapState } from "vuex";
export default {
  name: "Journee",
  components: {
    CourseTimelineItem
  },
  computed: {
    ...mapState(["currentDate"]),
    date() {
      return this.currentDate.toISOString().substring(0, 10);
    },
    courses() {
      return Course.query()
        .with("chauffeur")
        .with("patient")
        .orderBy("time", "asc")
        .get();
    },
    coursesToday() {
      if (this.currentDate) {
        return this.courses.filter(course => course.date === this.date);
      }
    }
  },
  watch: {
    courses() {
      console.log(this.courses);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
