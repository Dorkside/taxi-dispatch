import { Model } from "@vuex-orm/core";
import { db } from "../store/db";
import Course from "./Course";

export default class Patient extends Model {
  static entity = "patients";

  static fields() {
    return {
      id: this.string(""),
      name: this.string(""),
      surname: this.string(""),
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
      deleted: this.string("")
    };
  }

  static new() {
    db.collection("patients").doc();
  }

  static create(patientData) {
    db.collection("patients").add({
      ...patientData,
      name: patientData
        ? patientData.name || "Nouveau patient"
        : "Nouveau patient",
      deleted: ""
    });
  }

  update(data) {
    db.collection("patients")
      .doc(this.id)
      .update(data);
  }

  delete() {
    Course.query()
      .where("patient_id", this.$id)
      .get()
      .forEach(course => {
        course.delete();
      });
    db.collection("patients")
      .doc(this.id)
      .update({ deleted: new Date().toISOString() });
  }

  get color() {
    switch (this.type) {
      case "Dialyse":
        return "CornflowerBlue";
      case "HDJ":
        return "Tomato";
      case "Kiné / Rééducation":
        return "grey";
      case "Consultation":
        return "ForestGreen";
      default:
        return "grey";
    }
  }

  get shortType() {
    switch (this.type) {
      case "Dialyse":
        return "D";
      case "HDJ":
        return "HDJ";
      case "Kiné / Rééducation":
        return "K";
      case "Consultation":
        return "C";
      default:
        return "?";
    }
  }

  prettyTime(day, r = false) {
    return this[day.toLowerCase() + (r ? "Retour" : "")] || "--:--";
  }
}
