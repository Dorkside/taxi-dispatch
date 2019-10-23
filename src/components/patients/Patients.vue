<template>
  <v-container class="d-flex flex-column pa-0" fluid>
    <div
      class="d-flex blue accent-1 action-bar py-0 px-4 elevation-2 align-center"
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

    <RecycleScroller
      v-slot="{ item }"
      class="scroller pa-2"
      :items="filteredPatients"
      :item-size="72"
      key-field="id"
    >
      <v-container class="pa-0 patient d-flex align-center">
        <v-avatar :color="item.color" size="36" class="white--text">
          {{ item.shortType }}
        </v-avatar>

        <v-text-field
          label="Regular"
          single-line
          :value="item.name"
          class="mx-2 flex-grow-1"
          placeholder="Nom"
          @change="changeName($event, item)"
        ></v-text-field>

        <v-select
          :items="types"
          :value="item.type"
          class="mx-2 type flex-grow-0 flex-shrink-1"
          label="Type"
          dense
          @change="changeType($event, item)"
        ></v-select>

        <v-btn text outlined color="red" @click="deletePatient(item)">
          <v-icon>mdi-delete-forever</v-icon> Supprimer
        </v-btn>
      </v-container>
      <v-divider></v-divider>
    </RecycleScroller>
  </v-container>
</template>

<script>
import Patient from "@/models/Patient";
export default {
  name: "Patients",
  data() {
    return {
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
    changeName($event, patient) {
      patient.update({ name: $event });
    },
    changeType($event, patient) {
      patient.update({
        type: $event
      });
    },
    deletePatient(patient) {
      patient.delete();
    },
    addPatient() {
      Patient.create();
    }
  }
};
</script>

<style scoped lang="scss">
.action-bar {
  z-index: 2;
  position: sticky;
  min-height: 64px;
  top: 0;
}
.scroller {
  width: 100%;
}
.patient {
  height: 72px;
  .type {
    width: 200px;
  }
}
</style>
