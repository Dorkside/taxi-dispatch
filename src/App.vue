<template>
  <v-app class="overflow-hidden">
    <vue100vh :css="{ height: '100rvh' }">
      <v-app-bar color="blue accent-4 justify-space-between">
        <v-toolbar-title class="white--text d-none d-md-block">
          <v-chip class="yellow darken-2">SARL OKA</v-chip> |
          <v-chip class="yellow darken-2">Taxi Cicciu</v-chip> |
          <v-chip class="yellow darken-2">SAS TAP</v-chip>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div center class="d-flex align-center justify-center white--text">
          <v-btn text icon small class="white--text" @click="shiftDate(-1)">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <v-dialog v-model="dialog" center width="400">
            <template v-slot:activator="{ on }">
              <v-btn text dark center class="date-text" v-on="on">
                <v-icon>mdi-calendar</v-icon>
                <span class="d-none d-md-block">{{ prettyDate }}</span>
                <span class="d-block d-md-none">{{ prettyDateShort }}</span>
              </v-btn>
            </template>
            <v-date-picker
              full-width
              locale="fr"
              :value="date"
              @change="
                setDate($event);
                dialog = false;
              "
            ></v-date-picker>
          </v-dialog>
          <v-btn text icon small class="white--text" @click="shiftDate(1)">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-btn text small dark right @click="logOut">
          <v-icon left>mdi-close</v-icon>
          <span class="d-none d-md-block">Déconnexion</span>
        </v-btn>
      </v-app-bar>
      <v-main
        class="pa-0 overflow-hidden"
        :style="{
          height: 'calc(100% - 64px)'
        }"
      >
        <div
          v-if="admin"
          class="elevation-8 pa-0 z-index-10 align-center d-none d-md-block"
        >
          <v-tabs background-color="blue accent-3" dark class="flex-grow-1">
            <v-tab to="/journee">
              <v-icon left>mdi-view-sequential</v-icon>
              Journée
            </v-tab>
            <v-tab v-if="admin" to="/departs">
              <v-icon left>mdi-view-parallel</v-icon>
              Départs
            </v-tab>
            <v-tab v-if="admin" to="/series">
              <v-icon left>mdi-medical-bag</v-icon>
              Patients
            </v-tab>
            <v-tab v-if="admin" to="/chauffeurs">
              <v-icon left>mdi-car</v-icon>
              Chauffeurs
            </v-tab>
            <v-tab v-if="admin" to="/places">
              <v-icon left>mdi-hospital-building</v-icon>
              Etablissements
            </v-tab>
            <v-tab v-if="admin" to="/facturation">
              <v-icon left>mdi-receipt</v-icon>
              Facturation
            </v-tab>
          </v-tabs>
        </div>
        <v-container
          fluid
          class="pa-0 overflow-hidden"
          :style="{
            height: 'calc(100% - 48px)',
            maxHeight: 'calc(100% - 48px)'
          }"
        >
          <router-view></router-view>
        </v-container>
      </v-main>
    </vue100vh>
  </v-app>
</template>

<script>
import vue100vh from "vue-100vh";
import { mapState } from "vuex";
import store from "@/store";

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
      dialog: false
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
      } else {
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
.date-text {
  width: 100%;
  max-width: 300px;
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
</style>
