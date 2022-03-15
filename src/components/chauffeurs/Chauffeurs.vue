<template>
  <div class="d-flex flex-column pa-0" :style="{ height: 'calc(100%)' }">
    <div
      class="d-flex amber darken-2 action-bar py-0 px-4 elevation-2 align-center flex-grow-0 flex-shrink-0"
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
            <v-icon>mdi-plus-circle</v-icon> Ajouter chauffeur
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Créer un nouveau chauffeur</span>
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid">
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
                :rules="phoneRules"
                prepend-inner-icon="mdi-phone"
                autocomplete="nofill"
                required
              ></v-text-field>
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
      <v-data-table
        item-key="id"
        :headers="chauffeurHeaders"
        :disable-pagination="true"
        :items="chauffeurs"
        :hide-default-footer="true"
        style="flex: 1;"
        class="chauffeurs-table"
      >
        <template v-slot:body="props">
          <v-lazy v-for="item in props.items" :key="item.id" tag="tr">
            <div style="display: contents;">
              <td width="56">
                <v-avatar
                  :style="{ backgroundColor: 'grey' }"
                  size="24"
                  class="white--text"
                >
                  {{ item.initiales }}
                </v-avatar>
              </td>
              <td>
                <v-text-field
                  label="Regular"
                  single-line
                  :value="item.name"
                  class="mr-2 mt-2 flex-grow-1"
                  placeholder="Nom"
                  dense
                  @change="changeName($event, item)"
                ></v-text-field>
              </td>
              <td class="d-flex flex-row">
                <v-form
                  v-for="(phone, index) of item.phones"
                  :key="index"
                  v-model="validPhones[phone.id]"
                  class="d-flex flex-row"
                >
                  <v-chip class="ma-1" close @click:close="deletePhone(phone)">
                    <v-text-field
                      prepend-inner-icon="mdi-phone"
                      label="Regular"
                      single-line
                      :value="phone.value"
                      placeholder="Téléphone"
                      dense
                      hide-details
                      :rules="phoneRules"
                      @change="changeValue($event, phone)"
                    ></v-text-field>
                  </v-chip>
                </v-form>
              </td>
              <td width="32">
                <v-btn
                  text
                  icon
                  @click="addPhone(newPhones[item.id].value, item)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
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
import Chauffeur from "@/models/Chauffeur";
import Phone from "@/models/Phone";
export default {
  name: "Chauffeurs",
  data() {
    return {
      dialog: false,
      searchTerms: "",
      newChauffeur: {
        name: null,
        phones: []
      },
      deleteData: undefined,
      dialogDelete: false,
      valid: false,
      validPhones: {},
      newPhones: [],
      chauffeurHeaders: [
        {
          sortable: false
        },
        {
          text: "Nom",
          sortable: false
        },
        {
          text: "Téléphone",
          sortable: false
        },
        {
          sortable: false
        },
        {
          sortable: false
        }
      ]
    };
  },
  computed: {
    chauffeurs: {
      get() {
        return Chauffeur.query()
          .where("deleted", "")
          .with("phones")
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
    phoneRules() {
      return [
        v => !!v || "Numéro obligatoire",
        v =>
          !v ||
          /^(\+33)[1-9][0-9]{8}$/g.test(v) ||
          "Numéro invalide (doit commencer par +33)"
      ];
    },
    newPhoneRules() {
      return [
        v =>
          !v ||
          /^(\+33)[1-9][0-9]{8}$/g.test(v) ||
          "Numéro invalide (doit commencer par +33)",
        v =>
          !this.phones.map(p => p.value).includes(v) || "Numéro déjà attribué"
      ];
    },
    phones() {
      return Phone.query().get();
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
  watch: {
    chauffeurs: {
      handler() {
        this.newPhones = this.chauffeurs.reduce((result, chauffeur) => {
          result[chauffeur.id] = {
            value: "",
            valid: false
          };
          return result;
        }, {});
      },
      immediate: true
    }
  },
  methods: {
    deleteModal(item) {
      this.deleteData = item;
      this.dialogDelete = true;
    },
    createChauffeur(data) {
      Chauffeur.create({ ...data, phones: data.phone });
      this.resetData();
    },
    resetData() {
      this.newChauffeur = {
        name: null,
        phones: []
      };
    },
    changeName($event, chauffeur) {
      chauffeur.update({ name: $event });
    },
    deleteChauffeur(chauffeur) {
      chauffeur.delete();
    },
    changeValue($event, phone) {
      if (this.validPhones[phone.id]) {
        phone.update({ value: $event });
      }
    },
    addPhone(phone, chauffeur) {
      chauffeur.addPhone(phone);
    },
    deletePhone(phone) {
      phone.delete();
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
  top: 8px;
  right: 8px;
  z-index: 100;
}
.scroller {
  overflow-y: auto;
}
.chauffeurs-table {
  tr:nth-child(2n) {
    background: #f3f3f3;
  }
  tr:hover {
    background: #e0e0e0;
  }
  td {
    padding: 0 8px;
  }
}
</style>
