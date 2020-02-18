<template>
  <div
    class="d-flex flex-column pa-0 ma-0 z-index-8 align-start"
    :style="{ height: '100%' }"
  >
    <div
      class="d-flex blue accent-1 action-bar py-0 px-4 elevation-2 pa-0 align-center flex-grow-0 flex-shrink-0"
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

    <div class="pa-0 d-flex justify-end days-label-container">
      <v-spacer></v-spacer>
      <span
        v-for="day of days"
        :key="day"
        class="day-label pt-1 flex-grow-0 flex-shrink-0 text-center"
        style="width: 80px;"
      >
        {{ day }}
      </span>
    </div>
    <RecycleScroller
      v-slot="{ item }"
      class="scroller pa-2 pt-10"
      :style="{ height: '100%' }"
      :items="filteredPatients"
      :item-size="72"
      key-field="id"
    >
      <v-divider></v-divider>
      <div class="pa-0 patient d-flex justify-end align-center">
        <v-btn text icon color="red" @click="deleteModal(item)">
          <v-icon>mdi-delete-forever</v-icon>
        </v-btn>
        <v-avatar
          :style="{ backgroundColor: item.color }"
          size="36"
          class="white--text"
        >
          {{ item.shortType }}
        </v-avatar>

        <v-select
          :items="types"
          :value="item.type"
          :hide-details="true"
          class="mx-2 type flex-shrink-1"
          style="max-width: 200px;"
          label="Type"
          dense
          @change="changeType($event, item)"
        >
        </v-select>

        <v-text-field
          label="Nom"
          dense
          :hide-details="true"
          :value="item.surname"
          class="mx-2 flex-grow-1"
          @change="changeSurname($event, item)"
        ></v-text-field>

        <v-text-field
          label="Prénom"
          dense
          :hide-details="true"
          :value="item.name"
          class="mx-2 flex-grow-1"
          @change="changeName($event, item)"
        ></v-text-field>

        <div
          style="width:32px;height: 100%;"
          class="d-flex flex-column justify-space-around"
        >
          <v-icon>
            mdi-arrow-right
          </v-icon>
          <v-icon>
            mdi-arrow-left
          </v-icon>
        </div>

        <patient-day-cell
          v-for="day of days"
          :key="day"
          class="flex-grow-0 flex-shrink-0 text-center"
          width="80px"
          :patient="item"
          :day="day"
        />
      </div>
    </RecycleScroller>
  </div>
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
      searchTerms: "",
      deleteData: undefined,
      dialogDelete: false
    };
  },
  computed: {
    patients() {
      return Patient.query()
        .orderBy("surname", "asc")
        .get();
    },
    search() {
      return this.searchTerms.toLowerCase().split(" ");
    },
    filteredPatients() {
      if (this.searchTerms) {
        return this.patients.filter(patient => {
          return this.search.every(s => {
            return `${patient.name} ${patient.surname}`
              .toLowerCase()
              .includes(s);
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
    },
    deletePatient(patient) {
      patient.delete();
    },
    changeName($event, patient) {
      patient.update({ name: $event });
    },
    changeSurname($event, patient) {
      patient.update({ surname: $event });
    },
    changeType($event, patient) {
      patient.update({
        type: $event
      });
    },
    deleteModal(item) {
      this.deleteData = item;
      this.dialogDelete = true;
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
.scroll {
  overflow-y: scroll;
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
