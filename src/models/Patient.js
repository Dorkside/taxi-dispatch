import FirebaseModel from "./FirebaseModel";

import Course from "./Course";
import Place from "./Place";
import Types from "../database/types";

export default class Patient extends FirebaseModel {
  static entity = "patients";

  static fields() {
    return {
      id: this.string(""),
      name: this.string(""),
      surname: this.string(""),
      societe: this.string(""),
      type: this.string("Consultation"),
      courses: this.hasMany(Course, "patient_id"),
      lundi: this.string(""),
      lundiRetour: this.string(""),
      mardi: this.string(""),
      mardiRetour: this.string(""),
      mercredi: this.string(""),
      mercrediRetour: this.string(""),
      jeudi: this.string(""),
      jeudiRetour: this.string(""),
      vendredi: this.string(""),
      vendrediRetour: this.string(""),
      samedi: this.string(""),
      samediRetour: this.string(""),
      dimanche: this.string(""),
      dimancheRetour: this.string(""),
      deleted: this.string(""),
      place: this.belongsTo(Place, "place_id"),
      place_id: this.string(""),
      adresse: this.string(""),
      telephone: this.string("")
    };
  }

  static new() {
    this.add();
  }

  static async create(patientData) {
    return new Patient(
      await this.add({
        ...patientData,
        name: patientData
          ? patientData.surname || patientData.name
            ? `${patientData.surname} ${patientData.name}`
            : "Nouveau patient"
          : "Nouveau patient",
        adresse: patientData ? patientData.adresse || "" : "",
        deleted: patientData ? patientData.deleted || "" : ""
      })
    );
  }

  update(data) {
    super.update(data);
  }

  delete() {
    Course.query()
      .where("patient_id", this.$id)
      .where("deleted", "")
      .where("doneDate", "")
      .get()
      .forEach(course => {
        course.delete(true);
      });
    super.update({ deleted: new Date().toISOString() });
  }

  get color() {
    return Types[this.type].color;
  }

  get fullname() {
    return `${this.surname} ${this.name}`;
  }

  get shortType() {
    return Types[this.type].shortName;
  }

  get schedules() {
    return [
      "lundi",
      "lundiRetour",
      "mardi",
      "mardiRetour",
      "mercredi",
      "mercrediRetour",
      "jeudi",
      "jeudiRetour",
      "vendredi",
      "vendrediRetour",
      "samedi",
      "samediRetour",
      "dimanche",
      "dimancheRetour"
    ].reduce((schedules, day) => {
      if (!schedules) {
        schedules = {};
      }
      const _day = day.slice(0, 2).toUpperCase();
      if (!schedules[_day]) {
        schedules[_day] = { a: "--:--", r: "--:--" };
      }
      if (this[day]) {
        if (day.includes("Retour")) {
          schedules[_day].r = this[day];
        } else {
          schedules[_day].a = this[day];
        }
      }
      return schedules;
    }, undefined);
  }

  prettyTime(day, r = false) {
    return this[day.toLowerCase() + (r ? "Retour" : "")] || "--:--";
  }
}
