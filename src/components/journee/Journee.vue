<template>
  <v-card>
    <v-list>
      <template v-for="(course, index) in courses">
        <v-list-item :key="course.id">
          <v-list-item-avatar :color="course.patient.color()">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>
              {{ course.patient.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider
          :key="'_' + course.id"
          v-if="index !== courses.length - 1"
        ></v-divider>
      </template>
    </v-list>
  </v-card>
</template>

<script>
import Course from "@/models/Course";
export default {
  name: "Journee",
  computed: {
    courses() {
      return Course.query()
        .with("chauffeur")
        .with("patient")
        .orderBy("id", "desc")
        .get();
    }
  }
};
</script>

<style scoped lang="scss">
</style>
