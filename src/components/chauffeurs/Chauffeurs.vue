<template>
  <v-simple-table>
    <thead>
      <tr>
        <th></th>
        <th class="text-left">Chauffeur</th>
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
            @blur="commitName(chauffeur)"
          ></v-text-field>
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
import Chauffeur from "@/models/Chauffeur";
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
    changeName($event, chauffeur) {
      chauffeur.name = $event;
    },
    commitName(chauffeur) {
      chauffeur.$save();
    }
  }
};
</script>

<style scoped lang="scss"></style>
