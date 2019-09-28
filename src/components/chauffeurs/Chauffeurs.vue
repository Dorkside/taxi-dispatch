<template>
  <v-simple-table class="flex-grow-1">
    <thead>
      <tr>
        <th class="text-left">Chauffeur</th>
        <th width="200px">
          <v-btn @click="createChauffeur()">
            <v-icon>mdi-plus-circle</v-icon> Ajouter chauffeur
          </v-btn>
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
import { db } from "../../store/db";
export default {
  name: "Chauffeurs",
  computed: {
    chauffeurs() {
      return Chauffeur.query()
        .orderBy("name", "asc")
        .get();
    }
  },
  methods: {
    createChauffeur() {
      Chauffeur.create();
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
