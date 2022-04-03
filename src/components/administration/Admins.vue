<template>
  <div
    class="d-flex flex-column pa-0 flex-grow-1"
    :style="{ height: 'calc(100%)' }"
  >
    <div class="scroller pa-2 d-flex flex-shrink-1">
      <v-data-table
        item-key="id"
        :headers="usersHeader"
        :disable-pagination="true"
        :items="users"
        :hide-default-footer="true"
        style="flex: 1;"
        class="users-table"
      >
        <template v-slot:body="props">
          <v-lazy v-for="item in props.items" :key="item.id" tag="tr">
            <div style="display: contents;">
              <td>
                {{ item.phoneNumber || item.email }}
              </td>
              <td width="120">
                <v-btn
                  v-if="!item.admin"
                  text
                  color="blue"
                  class="float-right"
                  @click="item.makeAdmin(true)"
                >
                  <v-icon>{{ mdiAccountArrowUp }}</v-icon>
                  <span>Rendre admin</span>
                </v-btn>
                <v-btn
                  v-else
                  text
                  color="red"
                  class="float-right"
                  @click="item.makeAdmin(false)"
                >
                  <v-icon>{{ mdiAccountArrowDown }}</v-icon>
                  <span>Enlever admin</span>
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
import { mdiAccountArrowUp, mdiAccountArrowDown } from "@mdi/js";
import User from "@/models/User";
export default {
  name: "Admins",
  data() {
    return {
      valid: false,
      usersHeader: [
        {
          sortable: false,
          text: "Identifiant"
        },
        {
          sortable: false
        }
      ],
      mdiAccountArrowUp,
      mdiAccountArrowDown
    };
  },
  computed: {
    users: {
      get() {
        return User.query().get();
      }
    }
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.scroller {
  overflow-y: auto;
}
.users-table {
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
