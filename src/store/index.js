import Vue from "vue";
import Vuex from "vuex";
import VuexORM from "@vuex-orm/core";
import database from "@/database";
import VuexORMGraphQL from "@vuex-orm/plugin-graphql";

VuexORM.use(VuexORMGraphQL, { database });

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [VuexORM.install(database)]
});

export default store;
