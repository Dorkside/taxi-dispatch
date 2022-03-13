<template>
  <div class="d-flex flex-column pa-0" :style="{ height: '100%' }">
    <div
      class="d-flex amber darken-2 action-bar py-0 px-4 elevation-2 align-center flex-grow-0 flex-shrink-0"
    >
      <v-spacer></v-spacer>
      <v-btn text class="float-right" @click.stop="print('TAP')">
        <v-icon>mdi-printer</v-icon> TAP
      </v-btn>
      <v-btn text class="float-right" @click.stop="print('OKA')">
        <v-icon>mdi-printer</v-icon> OKA
      </v-btn>
      <v-btn text class="float-right" @click.stop="print('Cicciu')">
        <v-icon>mdi-printer</v-icon> Cicciu
      </v-btn>
    </div>

    <v-dialog v-model="dialog" width="500" class="pa-0">
      <v-card v-if="dialogData">
        <v-card-title
          class="headline grey lighten-2 d-flex space-between"
          primary-title
        >
          <span class="flex-grow-1">
            {{ dialogData.name }}
          </span>

          <v-btn text icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-0">
          <div style="height: 50vh; max-height: 50vh; overflow-y: auto;">
            <v-simple-table>
              <template v-slot:default>
                <thead style="position: sticky; top: 0;">
                  <tr>
                    <th class="text-left">Date</th>
                    <th class="text-left">Heure</th>
                    <th class="text-left">Chauffeur</th>
                    <th class="text-left">Société</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="course in coursesByPatient[dialogData.id]"
                    :key="course.id"
                  >
                    <td>{{ prettyDate(course.date) }}</td>
                    <td>{{ course.time }}</td>
                    <td>
                      <span v-if="course.chauffeur">
                        {{ course.chauffeur.name }}
                      </span>
                    </td>
                    <td>
                      <span v-if="course.patient">
                        {{ course.patient.societe }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <div
      class="flex-grow-1 flex-shrink-1 d-flex flex-nowrap flex-row justify-stretch"
      style="overflow: hidden;"
    >
      <div class="scroller flex-grow-1 flex-shrink-1" style="max-width: 300px;">
        <v-timeline dense class="pr-4" style="min-height: 100%;">
          <v-timeline-item v-for="(month, i) in months" :key="i" small fill-dot>
            <v-chip
              :color="currentMonth === month.date + '-01' ? 'primary' : ''"
              @click="setMonth(month.date)"
            >
              {{ month.string }}
            </v-chip>
          </v-timeline-item>
        </v-timeline>
      </div>
      <div class="scroller elevation-1 flex-grow-1 pa-4">
        <v-chip>{{ monthlyCourses.length }} courses</v-chip>
        <div class="pa-2">
          <v-label v-if="patientsSansSociete.length">
            {{ patientsSansSociete.length }} patients sans société
            <v-chip
              v-for="patient in patientsSansSociete"
              :key="patient.id"
              x-small
            >
              {{ patient.surname }} {{ patient.name }}
            </v-chip>
          </v-label>
        </div>

        <v-text-field
          v-model="searchTerms"
          prepend-inner-icon="mdi-magnify"
          class="flex-grow-1 flex-shrink-0"
          label="Recherche"
          dense
          clearable
        >
        </v-text-field>

        <v-list style="background-color: transparent;">
          <v-lazy
            v-for="patient in filteredPatients"
            :key="patient.id"
            min-height="48"
          >
            <v-list-item class="pa-0 patient d-flex align-center">
              <span class="mx-2 flex-grow-1">
                {{ patient.surname }} {{ patient.name }}
              </span>

              <v-btn
                dark
                @click="
                  dialogData = patient;
                  dialog = true;
                "
              >
                {{ coursesByPatient[patient.id].length }} course{{
                  coursesByPatient[patient.id].length > 1 ? "s" : ""
                }}
              </v-btn>
            </v-list-item></v-lazy
          >
        </v-list>
      </div>
    </div>
  </div>
</template>

<script>
import Course from "@/models/Course";
import * as dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "Facturation",
  data() {
    return {
      searchTerms: "",
      dialog: false,
      dialogData: null,
      currentMonth: dayjs().format("YYYY-MM") + "-01"
    };
  },
  computed: {
    courses() {
      return Course.query()
        .where("deleted", "")
        .where("doneDate", value => value !== "")
        .with("chauffeur")
        .with("patient")
        .get()
        .filter(course =>
          ["Dialyse", "HDJ", "Kiné / Rééducation", "Radiothérapie"].includes(
            course.type
          )
        );
    },
    months() {
      const months = [];
      const startDate = "2020-02";
      const todayDate = new Date().toISOString().slice(0, 7);
      const [startYear, startMonth] = startDate.split("-").map(Number);
      const [todayYear, todayMonth] = todayDate.split("-").map(Number);
      const totalMonths =
        (todayYear - startYear) * 12 + (todayMonth - startMonth);
      for (let i = startMonth; i < startMonth + totalMonths; i += 1) {
        months.push(
          `${startYear + Math.floor(i / 12)}-${
            (i % 12) + 1 < 10 ? "0" : ""
          }${(i % 12) + 1}`
        );
      }
      return [startDate, ...months].reverse().map(month => ({
        date: month,
        string: dayjs(`${month}-01`).format("MMMM YYYY")
      }));
    },
    monthlyCourses() {
      return this.courses.filter(course => {
        return dayjs(course.date).isSame(this.currentMonth, "month");
      });
    },
    patients() {
      return this.monthlyCourses
        .reduce((patients, course) => {
          if (course.patient) {
            if (!patients.includes(course.patient)) {
              patients.push(course.patient);
            }
          }
          return patients;
        }, [])
        .sort((a, b) => (a.name > b.name ? 1 : -1));
    },
    patientsSansSociete() {
      return this.patients.filter(p => !p.societe);
    },
    coursesByPatient() {
      return this.monthlyCourses
        .filter(course => !!course.patient)
        .sort((a, b) => {
          if (a.patient.surname > b.patient.surname) {
            return 1;
          }
          if (a.patient.surname < b.patient.surname) {
            return -1;
          }
          if (a.patient.name > b.patient.name) {
            return 1;
          }
          if (a.patient.name < b.patient.name) {
            return -1;
          }
          return 0;
        })
        .reduce((patients, course) => {
          if (!patients[course.patient.id]) patients[course.patient.id] = [];
          patients[course.patient.id].push(course);
          return patients;
        }, {});
    },
    search() {
      return this.searchTerms.toLowerCase().split(" ");
    },
    filteredPatients() {
      if (this.searchTerms) {
        return this.patients.filter(patient => {
          return this.search.every(s => {
            return `${patient.name} ${patient.surname}`
              .toLowerCase()
              .includes(s);
          });
        });
      }
      return this.patients;
    }
  },
  mounted() {
    this.setMonth(dayjs().format("YYYY-MM"));
  },
  methods: {
    setMonth(date) {
      this.currentMonth = date + "-01";
      Course.fetchMonth(date);
    },
    prettyDate(date) {
      return dayjs(date).format("dddd D MMMM YYYY");
    },
    print(societeName) {
      let societe;
      switch (societeName) {
        case "OKA":
          societe = {
            name: "SARL OKA",
            telephone: "06.68.66.66.06"
          };
          break;
        case "Cicciu":
          societe = {
            name: "Taxi CICCIU Christophe",
            telephone: "06.68.66.66.06"
          };
          break;
        case "TAP":
          societe = {
            name: "SAS TAP",
            telephone: "06.68.66.66.06"
          };
          break;
      }
      var doc = new jsPDF();

      Object.entries(this.coursesByPatient).forEach(
        ([patientId, courses], index) => {
          const societeCourses = courses.filter(
            c => c.patient.societe === societeName
          );
          if (societeCourses.length) {
            const patient = this.patients.find(
              patient => patient.id === patientId
            );

            doc.setFontSize(14);
            doc.text(societe.name, 20, 20, null, null, "left");

            doc.setFontSize(12);
            doc.text(societe.telephone, 20, 25, null, null, "left");

            doc.setFontSize(14);
            doc.text(
              "Relevé de transport",
              doc.internal.pageSize.width - 20,
              20,
              null,
              null,
              "right"
            );

            doc.setFontSize(12);
            doc.text(
              dayjs(this.currentMonth)
                .format("MMMM YYYY")
                .toUpperCase(),
              doc.internal.pageSize.width - 20,
              25,
              null,
              null,
              "right"
            );

            doc.setFontSize(14);
            doc.text(
              `${patient.surname.toUpperCase()} ${patient.name}`,
              doc.internal.pageSize.width - 20,
              50,
              null,
              null,
              "right"
            );
            doc.text(
              `${dayjs(this.currentMonth)
                .format("MMMM YYYY")
                .toUpperCase()}`,
              20,
              55,
              null,
              null,
              "left"
            );

            const jours = societeCourses
              .sort((a, b) => (a.date < b.date ? -1 : 1))
              .reduce((_jours, course) => {
                let date = this.prettyDate(course.date);
                let c = course.ref.includes("Retour") ? "R" : "A";
                if (!_jours[date]) {
                  _jours[date] = [c];
                } else {
                  _jours[date].push(c);
                }
                return _jours;
              }, {});

            doc.setFontSize(12);

            doc.autoTable({
              theme: "plain",
              styles: { lineWidth: 0.1, cellPadding: 0.6, fontSize: 10 },
              headStyles: { fillColor: [230, 230, 230] },
              footStyles: { halign: "right", fillColor: [230, 230, 230] },
              columnStyles: {
                1: { halign: "right" },
                2: { halign: "right" },
                3: { halign: "right", fillColor: [230, 230, 230] }
              },
              startY: 60,
              head: [["Date", "Allers", "Retours", "Total"]],
              body: [
                ...Object.keys(jours).map(jour => {
                  return [
                    jour,
                    jours[jour].filter(c => c !== "R").length,
                    jours[jour].filter(c => c === "R").length,
                    jours[jour].length
                  ];
                }),
                ...new Array(32 - Object.keys(jours).length).fill([
                  "",
                  "",
                  "",
                  ""
                ])
              ],
              foot: [
                Object.keys(jours).reduce(
                  (result, jour) => {
                    result[1] += jours[jour].filter(c => c !== "R").length;
                    result[2] += jours[jour].filter(c => c === "R").length;
                    result[3] += jours[jour].length;
                    return result;
                  },
                  ["Total", 0, 0, 0]
                )
              ]
            });

            doc.setFontSize(12);
            doc.setFontType("italic");
            doc.text(
              `Le ${new dayjs().format("DD MMMM YYYY")}`,
              doc.internal.pageSize.width - 30,
              250,
              null,
              null,
              "right"
            );

            doc.setFontType("normal");

            if (index < Object.keys(this.coursesByPatient).length - 1) {
              doc.addPage();
            }
          }
        }
      );

      doc.save(
        `export-${societeName}-${dayjs(this.currentMonth).format(
          "MMMM-YYYY"
        )}.pdf`
      );
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
  width: 100%;
  overflow-y: auto;
}
.patient {
  height: 44px;
  .type {
    width: 200px;
  }
}
</style>
