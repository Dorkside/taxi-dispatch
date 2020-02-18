<template>
  <div class="d-flex flex-column pa-0" :style="{ height: 'calc(100%)' }">
    <div
      class="d-flex blue accent-1 action-bar py-0 px-4 elevation-2 align-center flex-grow-0 flex-shrink-0"
    >
      <v-text-field
        v-model="searchTerms"
        prepend-inner-icon="mdi-magnify"
        class="flex-grow-1"
        label="Recherche"
        dense
        clearable
        @input="page = 1"
      >
      </v-text-field>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            <v-icon>mdi-plus-circle</v-icon> Ajouter chauffeur
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Créer un nouveau chauffeur</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newChauffeur.name"
              label="Nom"
              autocomplete="nofill"
              prepend-inner-icon="mdi-account"
              required
            ></v-text-field>
            <v-text-field
              v-model="newChauffeur.phone"
              label="Numéro de téléphone"
              prepend-inner-icon="mdi-phone"
              autocomplete="nofill"
              required
            ></v-text-field>
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
              @click="
                createChauffeur(newChauffeur);
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
          Etes-vous sûrs de vouloir supprimer le chauffeur
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
              deleteChauffeur(deleteData);
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
        v-model="chauffeurs"
        handle=".handle-chauffeur"
        :sort="true"
        group="chauffeurs"
        style="max-height: calc(100% - 48px);"
        class="d-flex flex-wrap pa-4 scroll"
      >
        <v-card
          v-for="item of chauffeurs"
          :key="item.id"
          style="width: 300px; height: 128px;"
          class="pa-0 ma-2 chauffeur align-start justify-start"
        >
          <div>
            <v-avatar
              :style="{ backgroundColor: 'grey' }"
              size="36"
              class="ma-2 white--text"
            >
              {{ item.initiales }}
            </v-avatar>
            <v-icon class="handle-chauffeur">
              {{ "mdi-arrow-all" }}
            </v-icon>
          </div>
          <div class="d-flex justify-center align-center">
            <v-text-field
              label="Regular"
              single-line
              :value="item.name"
              class="mx-2 flex-grow-1"
              placeholder="Nom"
              @change="changeName($event, item)"
            ></v-text-field>
            <v-btn text icon color="red" @click="deleteModal(item)">
              <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
          </div>
        </v-card>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Chauffeur from "@/models/Chauffeur";
export default {
  name: "Chauffeurs",
  components: {
    draggable
  },
  data() {
    return {
      dialog: false,
      searchTerms: "",
      newChauffeur: {
        name: null,
        phone: null
      },
      deleteData: undefined,
      dialogDelete: false
    };
  },
  computed: {
    chauffeurs: {
      get() {
        return Chauffeur.query()
          .orderBy("order", "asc")
          .orderBy("name", "asc")
          .get();
      },
      set(chauffeurs) {
        chauffeurs.forEach((chauffeur, index) => {
          if (chauffeur.order !== index) {
            chauffeur.update({ order: index });
          }
        });
      }
    },
    search() {
      return this.searchTerms.toLowerCase().split(" ");
    },
    filteredChauffeurs() {
      if (this.searchTerms) {
        return this.chauffeurs.filter(chauffeur => {
          return this.search.every(s => {
            return chauffeur.name.toLowerCase().includes(s);
          });
        });
      }
      return this.chauffeurs;
    }
  },
  methods: {
    deleteModal(item) {
      this.deleteData = item;
      this.dialogDelete = true;
    },
    createChauffeur(data) {
      Chauffeur.create(data);
      this.resetData();
    },
    resetData() {
      this.newChauffeur = {
        name: null,
        phone: null
      };
    },
    changeName($event, chauffeur) {
      chauffeur.update({ name: $event });
    },
    deleteChauffeur(chauffeur) {
      chauffeur.delete();
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
.handle-chauffeur {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 100;
}
.scroller {
  overflow-y: auto;
}
</style>
