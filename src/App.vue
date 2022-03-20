<template>
  <v-app class="overflow-hidden">
    <vue100vh :css="{ height: '100rvh' }">
      <v-app-bar v-if="loggedIn" color="amber justify-space-between">
        <div class="bg-gradient"></div>
        <v-toolbar-title
          class="stencil deep-orange--text text--darken-3 d-none d-md-block"
        >
          XI DRIVER
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div center class="d-flex align-center justify-center white--text">
          <v-btn text icon small @click="shiftDate(-1)">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <v-dialog v-model="dialog" center width="400">
            <template v-slot:activator="{ on }">
              <v-btn text center class="date-text" v-on="on">
                <v-icon>mdi-calendar</v-icon>
                <span class="d-none d-md-block">{{ prettyDate }}</span>
                <span class="d-block d-md-none">{{ prettyDateShort }}</span>
              </v-btn>
            </template>
            <v-date-picker
              full-width
              locale="fr"
              :value="date"
              color="amber"
              header-color="amber darken-2"
              @change="
                setDate($event);
                dialog = false;
              "
            ></v-date-picker>
          </v-dialog>
          <v-btn text icon small @click="shiftDate(1)">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-btn text small right @click="logOut">
          <v-icon left>mdi-close</v-icon>
          <span class="d-none d-md-block">Déconnexion</span>
        </v-btn>
      </v-app-bar>
      <v-container
        class="pa-0 overflow-hidden d-flex flex-row justify-stretch ma-0"
        :style="{
          height: loggedIn ? 'calc(100% - 56px)' : '100%',
          maxWidth: '100%'
        }"
      >
        <div
          v-if="admin"
          class="elevation-8 pa-0 z-index-10 flex-grow-0 align-end flex-shrink-1 amber darken-3 d-flex flex-column"
        >
          <v-tabs
            class="flex-grow-1 flex-shrink-0 d-flex flex-column"
            background-color="amber darken-4"
            vertical
            dark
          >
            <v-tab disabled><span v-if="menuDeployed">Courses</span></v-tab>
            <v-tab to="/journee">
              <v-icon>mdi-view-sequential</v-icon>
              <span v-if="menuDeployed" class="ml-2">
                Journée
              </span>
            </v-tab>
            <v-tab v-if="admin" to="/departs">
              <v-icon>mdi-view-parallel</v-icon>
              <span v-if="menuDeployed" class="ml-2">
                Départs
              </span>
            </v-tab>
            <v-spacer />
            <v-tab disabled><span v-if="menuDeployed">Annuaire</span></v-tab>
            <v-tab v-if="admin" to="/series">
              <v-icon>mdi-medical-bag</v-icon>
              <span v-if="menuDeployed" class="ml-2">
                Patients
              </span>
            </v-tab>
            <v-tab v-if="admin" to="/chauffeurs">
              <v-icon>mdi-car</v-icon>
              <span v-if="menuDeployed" class="ml-2">
                Chauffeurs
              </span>
            </v-tab>
            <v-tab v-if="admin" to="/places">
              <v-icon>mdi-hospital-building</v-icon>
              <span v-if="menuDeployed" class="ml-2">
                Etablissements
              </span>
            </v-tab>
            <v-spacer />
            <v-tab disabled>
              <span v-if="menuDeployed">Comptabilité</span>
            </v-tab>
            <v-tab v-if="admin" to="/facturation">
              <v-icon>mdi-receipt</v-icon>
              <span v-if="menuDeployed" class="ml-2">
                Facturation
              </span>
            </v-tab>
            <v-spacer />
            <v-tab disabled>
              <span v-if="menuDeployed">Administration</span>
            </v-tab>
            <v-tab v-if="admin" to="/societes">
              <v-icon>mdi-domain</v-icon>
              <span v-if="menuDeployed" class="ml-2">
                Sociétés
              </span>
            </v-tab>
            <v-tab v-if="admin" to="/categories">
              <v-icon>mdi-tag</v-icon>
              <span v-if="menuDeployed" class="ml-2">
                Catégories
              </span>
            </v-tab>
            <v-tab v-if="admin" to="/admins">
              <v-icon>{{ mdiAccountCog }}</v-icon>
              <span v-if="menuDeployed" class="ml-2">
                Admins
              </span>
            </v-tab>
          </v-tabs>
          <v-btn
            icon
            large
            class="ma-2"
            :style="{ transform: menuDeployed ? 'rotateZ(180deg)' : '' }"
            @click="() => (menuDeployed = !menuDeployed)"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
        <v-container
          class="pa-0 overflow-hidden d-flex flex-grow-1 flex-shrink-1"
          :style="{
            height: 'calc(100%)',
            maxHeight: 'calc(100%)',
            width: '100%',
            maxWidth: '100%'
          }"
        >
          <router-view></router-view>
        </v-container>
      </v-container>
    </vue100vh>
  </v-app>
</template>

<script>
import vue100vh from "vue-100vh";
import { mapState } from "vuex";
import store from "@/store";
import { mdiAccountCog } from "@mdi/js";

import { data } from "./models/contacts.json";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";

import Chauffeur from "./models/Chauffeur";
import Course from "./models/Course";
import Patient from "./models/Patient";
import Phone from "./models/Phone";
import Place from "./models/Place";

const subscribeToChanges = (Model, querySnapshot) => {
  const docChanges = querySnapshot.docChanges();
  Model.insertOrUpdate({
    data: docChanges
      .filter(change => change.type === "added")
      .map(change => ({
        ...change.doc.data(),
        id: change.doc.id
      }))
  });
  Model.insertOrUpdate({
    data: docChanges
      .filter(change => change.type === "modified")
      .map(change => ({
        ...change.doc.data(),
        id: change.doc.id
      }))
  });
  Model.delete({
    data: docChanges
      .filter(change => change.type === "removed")
      .map(change => ({
        id: change.doc.id
      }))
  });
};

export default {
  components: { vue100vh },
  store,
  data() {
    return {
      dialog: false,
      menuDeployed: false,
      loggedIn: false,
      mdiAccountCog
    };
  },
  computed: {
    ...mapState(["currentDate", "admin"]),
    prettyDate() {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      return new Date(this.currentDate).toLocaleDateString("fr-FR", options);
    },
    prettyDateShort() {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      };
      return new Date(this.currentDate).toLocaleDateString("fr-FR", options);
    },
    patients() {
      return Patient.query().get();
    },
    date() {
      return this.currentDate.toISOString().substring(0, 10);
    }
  },
  mounted() {
    const auth = getAuth();

    onAuthStateChanged(auth, user => {
      if (!user) {
        this.$store.commit("setAdmin", false);
        this.loggedIn = false;
      } else {
        this.loggedIn = true;
        const { driver } = this.$route.query;
        if (
          [
            "+33762686070",
            "+33761610703",
            "+33668666606",
            "+33658474169",
            "+33769186127"
          ].includes(user.phoneNumber) &&
          !driver
        ) {
          this.$store.commit("setAdmin", true);

          onSnapshot(collection(this.$db(), "phones"), function(querySnapshot) {
            subscribeToChanges(Phone, querySnapshot);
          });

          onSnapshot(collection(this.$db(), "chauffeurs"), function(
            querySnapshot
          ) {
            subscribeToChanges(Chauffeur, querySnapshot);
          });
        } else {
          getDoc(doc(this.$db(), "phones", user.phoneNumber)).then(phoneDoc => {
            const { chauffeur_id } = phoneDoc.data();

            onSnapshot(doc(this.$db(), "chauffeurs", chauffeur_id), function(
              chauffeurDoc
            ) {
              Chauffeur.insert({
                data: {
                  ...chauffeurDoc.data(),
                  id: chauffeurDoc.id
                }
              });
            });

            onSnapshot(
              Course.queryFirebase([
                ["deleted", "==", ""],
                ["chauffeur_id", "==", chauffeur_id]
              ]),
              function(querySnapshot) {
                subscribeToChanges(Course, querySnapshot);
              }
            );
          });
        }

        onSnapshot(collection(this.$db(), "patients"), function(querySnapshot) {
          subscribeToChanges(Patient, querySnapshot);
        });

        onSnapshot(collection(this.$db(), "places"), function(querySnapshot) {
          subscribeToChanges(Place, querySnapshot);
        });
      }

      this.setDate(new Date());
    });
  },
  methods: {
    setDate(event) {
      this.$store.commit("setDate", new Date(event));
    },
    logOut() {
      getAuth().signOut();
    },
    initContacts() {
      const types = ["dyal", "cs", "psy", "ipc", "kine"];
      const contacts = data
        .filter(contact => {
          const c = contact.split(" ");
          return (
            c.some(part => types.some(type => part.toLowerCase() === type)) &&
            !types.includes(c[0].toLowerCase())
          );
        })
        .map(contact => {
          let type = "Consultation";
          const parts = contact.split(" ");
          if (parts.some(part => part.toLowerCase() === "dyal")) {
            type = "Dialyse";
          }
          if (parts.some(part => part.toLowerCase() === "psy")) {
            type = "HDJ";
          }
          if (parts.some(part => part.toLowerCase() === "kine")) {
            type = "Kiné / Rééducation";
          }
          return {
            name: contact,
            type
          };
        });

      setTimeout(() => {
        contacts.forEach(contact => {
          if (!this.patients.some(patient => patient.name === contact.name)) {
            console.log(`Creating ${contact}`);
            Patient.create(contact);
          }
        });
      }, 5000);
    },
    shiftDate(shift) {
      this.$store.commit(
        "setDate",
        this.currentDate.setDate(this.currentDate.getDate() + shift)
      );
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Rubik+Mono+One&family=Stardos+Stencil:wght@400;700&display=swap");
.bg-gradient {
  background: linear-gradient(
    to left bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.03) 50%,
    rgba(0, 0, 0, 0.1) 100%
  );
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.date-text {
  width: 100%;
  max-width: 300px;
}
.stencil {
  font-family: Stardos Stencil, Consolas, monospace;
  font-weight: 900;
}
.toolbar-title {
  width: 100%;
}
.z-index-10 {
  position: relative;
  z-index: 10;
}
.z-index-9 {
  position: relative;
  z-index: 9;
}
.z-index-8 {
  position: relative;
  z-index: 8;
}
.z-index-7 {
  position: relative;
  z-index: 7;
}
.z-index-6 {
  position: relative;
  z-index: 6;
}
.v-tab {
  justify-content: start;
  min-width: 32px;
}
</style>
