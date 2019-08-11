<template>
  <v-layout>
    <v-flex xs3>
      <v-date-picker full-width v-model="picker"></v-date-picker>
    </v-flex>
    <v-flex>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "Calendar",
  data() {
    return {
      picker: new Date().toISOString().substr(0, 10)
    };
  }
};
</script>