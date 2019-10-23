<template>
  <v-container
    class="d-flex flex-column pa-0 ma-0 z-index-8 scroll align-start"
    fluid
    fill-height
  >
    <div
      class="d-flex blue accent-1 action-bar py-0 px-4 elevation-2 pa-0 align-center"
    >
      <v-text-field
        v-model="searchTerms"
        prepend-inner-icon="mdi-magnify"
        class="flex-grow-1"
        label="Recherche"
        dense
        clearable
      >
      </v-text-field>
      <v-btn text @click="addPatient()">
        <v-icon>mdi-plus-circle</v-icon> Ajouter patient
      </v-btn>
    </div>

    <v-container class="pa-0 d-flex justify-end days-label-container">
      <div v-for="day of days" :key="day" class="day-label pl-4 pt-1">
        <v-chip>{{ day }}</v-chip>
      </div>
    </v-container>
    <RecycleScroller
      v-slot="{ item }"
      class="scroller pa-2 pt-10"
      :items="filteredPatients"
      :item-size="72"
      key-field="id"
    >
      <v-divider></v-divider>
      <v-container class="pa-0 patient d-flex align-center">
        <v-avatar :color="item.color" size="36" class="white--text">
          {{ item.shortType }}
        </v-avatar>

        <span class="mx-2 flex-grow-1">{{ item.name }}</span>

        <patient-day-cell
          v-for="day of days"
          :key="day"
          width="100px"
          :patient="item"
          :day="day"
        />
      </v-container>
    </RecycleScroller>
  </v-container>
</template>

<script>
import Patient from "@/models/Patient";
import PatientDayCell from "@/components/semaine/PatientDayCell.vue";
export default {
  name: "Semaine",
  components: {
    PatientDayCell
  },
  data() {
    return {
      dialog: false,
      newTime: "",
      days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      types: ["Dialyse", "HDJ", "Consultation", "Kiné / Rééducation"],
      searchTerms: ""
    };
  },
  computed: {
    patients() {
      return Patient.query()
        .orderBy("name", "asc")
        .get();
    },
    search() {
      return this.searchTerms.toLowerCase().split(" ");
    },
    filteredPatients() {
      if (this.searchTerms) {
        return this.patients.filter(patient => {
          return this.search.every(s => {
            return patient.name.toLowerCase().includes(s);
          });
        });
      }
      return this.patients;
    }
  },
  methods: {
    cancel() {
      this.dialog = false;
    },
    addPatient() {
      Patient.create();
    }
  }
};
</script>

<style scoped lang="scss">
.days-label-container {
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  z-index: 10;
}
.day-label {
  width: 100px;
}
.scroll {
  overflow-y: auto;
}
.action-bar {
  z-index: 2;
  position: sticky;
  min-height: 64px;
  top: 0;
  width: 100%;
}
.scroller {
  width: 100%;
}
.patient {
  height: 72px;
}
</style>
