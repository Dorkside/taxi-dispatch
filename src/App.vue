<template>
  <v-app class="overflow-hidden">
    <vue100vh :css="{ height: '100rvh' }">
      <v-app-bar color="blue accent-4 justify-space-between">
        <v-toolbar-title class="white--text">
          Taxi OKA
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div center class="d-flex align-center justify-center white--text">
          <v-btn text icon small class="white--text" @click="shiftDate(-1)">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <v-dialog v-model="dialog" center width="400">
            <template v-slot:activator="{ on }">
              <v-btn text dark center class="date-text" v-on="on">
                {{ prettyDate }}
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
          Déconnexion
        </v-btn>
      </v-app-bar>
      <v-content
        class="pa-0 overflow-hidden"
        :style="{
          border: 'solid 10px yellow',
          height: 'calc(100% - 64px)'
        }"
      >
        <div class="elevation-8 pa-0 z-index-10 align-center">
          <v-tabs background-color="blue accent-3" dark class="flex-grow-1">
            <v-tab to="/journee">
              <v-icon left>mdi-view-sequential</v-icon>
              Journée
            </v-tab>
            <v-tab to="/departs">
              <v-icon left>mdi-view-parallel</v-icon>
              Départs
            </v-tab>
            <v-tab to="/series">
              <v-icon left>mdi-calendar-week</v-icon>
              Séries
            </v-tab>
            <v-tab to="/patients">
              <v-icon left>mdi-medical-bag</v-icon>
              Patients
            </v-tab>
            <v-tab to="/chauffeurs">
              <v-icon left>mdi-car</v-icon>
              Chauffeurs
            </v-tab>
          </v-tabs>
        </div>
        <v-container
          fluid
          class="pa-0 overflow-hidden"
          :style="{
            border: 'solid 10px green',
            height: 'calc(100% - 48px)',
            maxHeight: 'calc(100% - 48px)'
          }"
        >
          <router-view></router-view>
        </v-container>
      </v-content>
    </vue100vh>
  </v-app>
</template>

<script>
import vue100vh from "vue-100vh";
import { mapState } from "vuex";
import store from "@/store";

import { data } from "./models/contacts.json";

import firebase from "firebase";

import { db } from "./store/db";
import Chauffeur from "./models/Chauffeur";
import Course from "./models/Course";
import Patient from "./models/Patient";

export default {
  components: { vue100vh },
  store,
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
    patients() {
      return Patient.query().get();
    },
    date() {
      return this.currentDate.toISOString().substring(0, 10);
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.$store.commit("setAdmin", false);
      } else {
        if (
          [
            "+330123456789",
            "+33123456789",
            "+33762686070",
            "+33761610703",
            "+33760910409",
            "+33668666606"
          ].includes(user.phoneNumber)
        ) {
          this.$store.commit("setAdmin", true);

          db.collection("chauffeurs")
            .where("deleted", "==", "")
            .onSnapshot(function(querySnapshot) {
              querySnapshot.docChanges().forEach(function(change) {
                if (change.type === "added") {
                  Chauffeur.insert({
                    data: {
                      ...change.doc.data(),
                      id: change.doc.id
                    }
                  });
                }
                if (change.type === "modified") {
                  Chauffeur.update({
                    where: change.doc.id,
                    data: change.doc.data()
                  });
                }
                if (change.type === "removed") {
                  Chauffeur.delete(change.doc.id);
                }
              });
            });

          db.collection("courses").onSnapshot(function(querySnapshot) {
            querySnapshot.docChanges().forEach(function(change) {
              if (change.type === "added") {
                Course.insert({
                  data: {
                    ...change.doc.data(),
                    id: change.doc.id
                  }
                });
              }
              if (change.type === "modified") {
                Course.update({
                  where: change.doc.id,
                  data: change.doc.data()
                });
              }
              if (change.type === "removed") {
                Course.delete(change.doc.id);
              }
            });
          });
        } else {
          db.collection("chauffeurs")
            .doc(user.phoneNumber)
            .onSnapshot(function(doc) {
              Chauffeur.insert({
                data: {
                  ...doc.data(),
                  id: doc.id
                }
              });
            });

          db.collection("courses")
            .where("deleted", "==", "")
            .where("chauffeur_id", "==", user.phoneNumber)
            .onSnapshot(function(querySnapshot) {
              querySnapshot.docChanges().forEach(function(change) {
                if (change.type === "added") {
                  Course.insert({
                    data: {
                      ...change.doc.data(),
                      id: change.doc.id
                    }
                  });
                }
                if (change.type === "modified") {
                  Course.update({
                    where: change.doc.id,
                    data: change.doc.data()
                  });
                }
                if (change.type === "removed") {
                  Course.delete(change.doc.id);
                }
              });
            });
        }

        db.collection("patients")
          .where("deleted", "==", "")
          .onSnapshot(function(querySnapshot) {
            querySnapshot.docChanges().forEach(function(change) {
              if (change.type === "added") {
                Patient.insert({
                  data: {
                    ...change.doc.data(),
                    id: change.doc.id
                  }
                });
              }
              if (change.type === "modified") {
                Patient.update({
                  where: change.doc.id,
                  data: change.doc.data()
                });
              }
              if (change.type === "removed") {
                Patient.delete(change.doc.id);
              }
            });
          });
      }
    });
  },
  created() {
    if (this.$workbox) {
      this.$workbox.addEventListener("waiting", () => {
        this.prompt = true;
      });
    }
  },
  data() {
    return {
      dialog: false,
      prompt: false
    };
  },
  methods: {
    setDate(event) {
      this.$store.commit("setDate", new Date(event));
    },
    async upgrade() {
      this.prompt = false;
      await this.$workbox.messageSW({ type: "SKIP_WAITING" });
    },
    logOut() {
      firebase.auth().signOut();
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
        console.log(this.patients);
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
  width: 300px;
}
.toolbar-title {
  width: 100%;
}
.title-scroll {
  position: sticky !important;
  top: 0;
  z-index: 11 !important;
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
