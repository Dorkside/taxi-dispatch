<template>
  <div
    class="d-flex flex-grow-1 flex-column pa-0"
    :style="{ height: 'calc(100%)' }"
  >
    <v-dialog v-model="dialogDelete" persistent max-width="290">
      <v-card>
        <v-card-title v-if="deleteData" class="headline">
          Etes-vous sûrs de vouloir supprimer la catégorie
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
              deleteCategory(deleteData);
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
        :headers="categoriesHeader"
        :disable-pagination="true"
        :items="categories"
        :hide-default-footer="true"
        style="flex: 1;"
        class="categories-table"
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
                  placeholder="Couleur"
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
import Category from "@/models/Category";

export default {
  name: "Categories",
  data() {
    return {
      dialog: false,
      newCategory: {
        name: null,
        color: null
      },
      deleteData: undefined,
      dialogDelete: false,
      valid: false,
      categoriesHeader: [
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
        return Category.query()
          .orderBy("name", "asc")
          .get();
      },
      set(categories) {
        categories.forEach((category, index) => {
          if (category.order !== index) {
            category.update({ order: index });
          }
        });
      }
    }
  },
  methods: {
    deleteModal(item) {
      this.deleteData = item;
      this.dialogDelete = true;
    },
    createCategory(data) {
      Category.create({ ...data });
      this.resetData();
    },
    resetData() {
      this.newCategory = {
        name: null
      };
    },
    changeName($event, category) {
      category.update({ name: $event });
    },
    changeColor($event, category) {
      category.update({ color: $event });
    },
    deleteCategory(category) {
      category.delete();
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
  overflow-y: auto;
}
.categories-table {
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
