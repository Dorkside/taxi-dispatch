<template>
  <v-layout fill-height class="max-vw">
    <v-flex xs3 class="elevation-6 z-index-9">
      <v-list>
        <v-list-item>
          <v-date-picker
            full-width
            :value="date"
            @input="setDate"
          ></v-date-picker>
        </v-list-item>
        <v-list-item>
          <v-btn block @click="addCourse()">
            <v-icon>mdi-plus-circle</v-icon> Ajouter course
          </v-btn>
        </v-list-item>
      </v-list>
    </v-flex>
    <v-flex>
      <v-layout column fill-height>
        <router-view></router-view>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import Course from "@/models/Course";
export default {
  name: "Calendar",
  computed: {
    ...mapState(["currentDate"]),
    date() {
      return this.currentDate.toISOString().substring(0, 10);
    }
  },
  methods: {
    setDate(event) {
      this.$store.commit("setDate", new Date(event));
    },
    addCourse() {
      Course.create({
        date: this.date,
        deleted: ""
      });
    }
  }
};
</script>

<style lang="scss">
.max-height {
  max-height: 100%;
  overflow-y: hidden;
}
.debug {
  border: solid 5px red;
}
.max-vw {
  max-width: 100vw;
  overflow: hidden;
}
</style>
