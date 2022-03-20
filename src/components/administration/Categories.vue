<template>
  <div
    class="d-flex flex-grow-1 flex-column pa-0"
    :style="{ height: 'calc(100%)' }"
  >
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
      <v-data-table
        item-key="id"
        :headers="placesHeader"
        :disable-pagination="true"
        :items="categories"
        :hide-default-footer="true"
        style="flex: 1;"
        class="places-table"
      >
        <template v-slot:body="props">
          <v-lazy v-for="item in props.items" :key="item.id" tag="tr">
            <div style="display: contents;">
              <td>
                <v-text-field
                  single-line
                  :value="item.name"
                  class="mr-2 flex-grow-1"
                  autocomplete="nofill"
                  placeholder="Nom"
                  @change="changeName($event, item)"
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                  single-line
                  label="Adresse"
                  :value="item.color"
                  class="mr-2 flex-grow-1"
                  placeholder="Adresse"
                  autocomplete="nofill"
                  @change="changeAdresse($event, item)"
                ></v-text-field>
              </td>
              <td width="120">
                <v-btn
                  text
                  color="red"
                  class="float-right"
                  @click="deleteModal(item)"
                >
                  <v-icon>mdi-delete-forever</v-icon> Supprimer
                </v-btn>
              </td>
            </div>
          </v-lazy>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import Place from "@/models/Place";

import Types from "../../database/types";

export default {
  name: "Places",
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
      valid: false,
      placesHeader: [
        {
          sortable: false,
          text: "Nom"
        },
        {
          sortable: false,
          text: "Couleur"
        },
        {
          sortable: false
        }
      ]
    };
  },
  computed: {
    categories: {
      get() {
        return Object.entries(Types).map(([key, value]) => {
          return {
            name: key,
            ...value
          };
        });
      },
      set(categories) {
        console.log(categories);
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
.places-table {
  tr:nth-child(2n) {
    background: #f3f3f3;
  }
  tr:hover {
    background: #e0e0e0;
  }
  td {
    padding: 2px 8px;
  }
}
</style>
