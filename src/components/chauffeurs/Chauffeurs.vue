<template>
  <v-simple-table class="flex-grow-1">
    <thead>
      <tr>
        <th class="text-left">Chauffeur</th>
        <th width="200px">
          <v-dialog v-model="dialog" persistent max-width="300px">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on">
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
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="chauffeur of chauffeurs" :key="chauffeur.id">
        <td>
          <v-text-field
            label="Regular"
            single-line
            :value="chauffeur.name"
            placeholder="Nom"
            @change="changeName($event, chauffeur)"
          ></v-text-field>
        </td>
        <td>
          <v-btn text outlined color="red" @click="deleteChauffeur(chauffeur)">
            <v-icon>mdi-delete-forever</v-icon> Supprimer
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
import Chauffeur from "@/models/Chauffeur";
export default {
  name: "Chauffeurs",
  data() {
    return {
      dialog: false,
      newChauffeur: {
        name: null,
        phone: null
      }
    };
  },
  computed: {
    chauffeurs() {
      return Chauffeur.query()
        .orderBy("name", "asc")
        .get();
    }
  },
  methods: {
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

<style scoped lang="scss"></style>
