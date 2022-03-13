<template>
  <div class="d-flex flex-column pa-0" :style="{ height: 'calc(100%)' }">
    <div
      class="d-flex blue accent-1 action-bar py-0 px-4 elevation-2 align-center flex-grow-0 flex-shrink-0"
    >
      <v-text-field
        v-model="searchTerms"
        hide-details
        prepend-inner-icon="mdi-magnify"
        class="flex-grow-1"
        label="Recherche"
        dense
        clearable
      >
      </v-text-field>

      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            <v-icon>mdi-plus-circle</v-icon> Ajouter établissement
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Créer un nouvel établissement</span>
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid">
              <v-text-field
                v-model="newPlace.name"
                label="Nom"
                autocomplete="nofill"
                prepend-inner-icon="mdi-hospital-building"
                required
              ></v-text-field>
              <v-textarea
                v-model="newPlace.adresse"
                label="Adresse"
                autocomplete="nofill"
                rows="3"
                prepend-inner-icon="mdi-map-marker"
              ></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn
              color="blue darken-1"
              text
              @click="
                resetData();
                dialog = false;
              "
            >
              Annuler
            </v-btn>
            <v-btn
              color="primary darken-1"
              :disabled="!valid"
              @click="
                createPlace(newPlace);
                dialog = false;
              "
            >
              Enregistrer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-dialog v-model="dialogDelete" persistent max-width="290">
      <v-card>
        <v-card-title v-if="deleteData" class="headline">
          Etes-vous sûrs de vouloir supprimer l'établissement
          {{ deleteData.name }} ?
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
              deletePlace(deleteData);
              deleteData = undefined;
              dialogDelete = false;
            "
          >
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="scroller pa-2 d-flex flex-shrink-1">
      <draggable
        v-model="places"
        handle=".handle-place"
        :sort="true"
        group="places"
        style="max-height: calc(100% - 48px);"
        class="d-flex flex-wrap pa-4 scroll"
      >
        <v-card
          v-for="item of places"
          :key="item.id"
          style="width: 300px;"
          class="pa-0 ma-2 place align-start justify-start"
        >
          <div
            class="d-flex flex-row pa-2 align-stretch"
            :style="{ backgroundColor: '#333333' }"
          >
            <div class="d-flex">
              <v-icon dark class="handle-place">
                mdi-drag
              </v-icon>
            </div>
            <div class="d-flex flex-grow-1 flex-column">
              <v-text-field
                dark
                single-line
                :value="item.name"
                class="mr-2 flex-grow-1"
                autocomplete="nofill"
                placeholder="Nom"
                @change="changeName($event, item)"
              ></v-text-field>
              <v-textarea
                dark
                label="Adresse"
                :value="item.adresse"
                class="mr-2 flex-grow-1"
                placeholder="Adresse"
                autocomplete="nofill"
                rows="3"
                @change="changeAdresse($event, item)"
              ></v-textarea>
            </div>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="red"
              class="float-right"
              @click="deleteModal(item)"
            >
              <v-icon>mdi-delete-forever</v-icon> Supprimer
            </v-btn>
          </v-card-actions>
        </v-card>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Place from "@/models/Place";
export default {
  name: "Places",
  components: {
    draggable
  },
  data() {
    return {
      dialog: false,
      searchTerms: "",
      newPlace: {
        name: null,
        adresse: null
      },
      deleteData: undefined,
      dialogDelete: false,
      valid: false
    };
  },
  computed: {
    places: {
      get() {
        return Place.query()
          .orderBy("order", "asc")
          .orderBy("name", "asc")
          .get();
      },
      set(places) {
        places.forEach((place, index) => {
          if (place.order !== index) {
            place.update({ order: index });
          }
        });
      }
    },
    search() {
      return this.searchTerms.toLowerCase().split(" ");
    },
    filteredPlaces() {
      if (this.searchTerms) {
        return this.places.filter(place => {
          return this.search.every(s => {
            return place.name.toLowerCase().includes(s);
          });
        });
      }
      return this.places;
    }
  },
  methods: {
    deleteModal(item) {
      this.deleteData = item;
      this.dialogDelete = true;
    },
    createPlace(data) {
      Place.create({ ...data });
      this.resetData();
    },
    resetData() {
      this.newPlace = {
        name: null
      };
    },
    changeName($event, place) {
      place.update({ name: $event });
    },
    changeAdresse($event, place) {
      console.log($event);
      place.update({ adresse: $event });
    },
    deletePlace(place) {
      place.delete();
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
.handle-place {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100;
}
.scroller {
  overflow-y: auto;
}
</style>
