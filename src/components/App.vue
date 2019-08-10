<template>
  <v-app>
    <AppHeader />

    <div class="container">
      <div class="users"><UsersSection /></div>
      <div class="todos"><TodosSection /></div>
    </div>

    <AppFooter />
  </v-app>
</template>

<script>
import store from "@/store";
import AppHeader from "./AppHeader";
import UsersSection from "./UsersSection";
import TodosSection from "./TodosSection";
import AppFooter from "./AppFooter";

export default {
  store,

  components: {
    AppHeader,
    UsersSection,
    TodosSection,
    AppFooter
  },

  data() {
    return {
      yay: "Hello!"
    };
  },

  created() {}
};
</script>

<style scoped>
.App {
  padding: 96px 48px 128px;
}

.container {
  display: flex;
  margin: 0 auto;
  width: 960px;
}

.users {
  padding-right: 48px;
  width: calc(100% / 3);
}

.todos {
  width: calc((100% / 3) * 2);
}
</style>
