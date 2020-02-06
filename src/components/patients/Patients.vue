<template>
  <div class="d-flex flex-column pa-0" :style="{ height: '100%' }">
    <div
      class="d-flex blue accent-1 action-bar py-0 px-4 elevation-2 align-center flex-grow-0 flex-shrink-0"
    >
      <v-text-field
        v-model="searchTerms"
        prepend-inner-icon="mdi-magnify"
        class="flex-grow-1 flex-shrink-0"
        label="Recherche"
        dense
        clearable
        @input="page = 1"
      >
      </v-text-field>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            <v-icon>mdi-plus-circle</v-icon> Ajouter patient
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Nouveau patient</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="newPatient.name"
                  label="Nom"
                  placeholder="Nom du patient"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="newPatient.type"
                  :items="types"
                  :value="newPatient.type"
                  class="mx-2 type flex-grow-0 flex-shrink-1"
                  label="Type"
                  dense
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Annuler
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="
                dialog = false;
                addPatient();
              "
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-dialog v-model="dialogDelete" persistent max-width="290">
      <v-card>
        <v-card-title v-if="deleteData" class="headline">
          Etes-vous sûrs de vouloir supprimer le patient {{ deleteData.name }} ?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="
              dialogDelete = false;
              deleteData = undefined;
            "
          >
            Annuler
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="
              deletePatient(deleteData);
              deleteData = undefined;
              dialogDelete = false;
            "
          >
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <RecycleScroller
      v-slot="{ item }"
      class="scroller pa-2 flex-grow-1 flex-shrink-1"
      :items="pagePatients"
      :item-size="72"
      key-field="id"
    >
      <div class="pa-0 patient d-flex align-center">
        <v-avatar
          :style="{ backgroundColor: item.color }"
          size="36"
          class="white--text"
        >
          {{ item.shortType }}
        </v-avatar>

        <v-text-field
          label="Prénom"
          dense
          :value="item.name"
          class="mx-2 flex-grow-1"
          @change="changeName($event, item)"
        ></v-text-field>

        <v-text-field
          label="Nom"
          dense
          :value="item.surname"
          class="mx-2 flex-grow-1"
          @change="changeSurname($event, item)"
        ></v-text-field>

        <v-select
          :items="types"
          :value="item.type"
          class="mx-2 type flex-grow-0 flex-shrink-1"
          label="Type"
          dense
          @change="changeType($event, item)"
        ></v-select>

        <v-btn text icon color="red" @click="deleteModal(item)">
          <v-icon>mdi-delete-forever</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>
    </RecycleScroller>
    <v-pagination
      v-model="page"
      class=" flex-grow-0 flex-shrink-0 elevation-4"
      :length="nbPages"
    ></v-pagination>
  </div>
</template>

<script>
import Patient from "@/models/Patient";
export default {
  name: "Patients",
  data() {
    return {
      types: ["Dialyse", "HDJ", "Consultation", "Kiné / Rééducation"],
      searchTerms: "",
      page: 1,
      newPatient: {
        name: "",
        type: "Consultation"
      },
      dialog: false,
      deleteData: undefined,
      dialogDelete: false
    };
  },
  computed: {
    patients() {
      return Patient.query()
        .orderBy("name", "asc")
        .get();
    },
    nbPages() {
      return Math.ceil(this.filteredPatients.length / 15);
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
    },
    pagePatients() {
      return this.filteredPatients.slice((this.page - 1) * 15, this.page * 15);
    }
  },
  methods: {
    deleteModal(item) {
      this.deleteData = item;
      this.dialogDelete = true;
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
    deletePatient(patient) {
      patient.delete();
    },
    addPatient() {
      Patient.create(this.newPatient);
      this.newPatient = {
        name: "",
        type: "Consultation"
      };
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
