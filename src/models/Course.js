import { Model } from "@vuex-orm/core";
import { db } from "../store/db";
import Chauffeur from "./Chauffeur";
import Patient from "./Patient";

export default class Course extends Model {
  static entity = "courses";

  static fields() {
    return {
      id: this.string(),
      ref: this.string(),
      chauffeur_id: this.string(),
      chauffeur: this.belongsTo(Chauffeur, "chauffeur_id"),
      patient_id: this.string(),
      patient: this.belongsTo(Patient, "patient_id"),
      date: this.string(new Date().toISOString().substring(0, 10)),
      time: this.string(""),
      priority: this.number(Infinity),
      generated: this.boolean(false),
      deleted: this.string(""),
      doneDate: this.string("")
    };
  }

  static create(data) {
    db.collection("courses").add(
      data || {
        date: this.string(new Date().toISOString().substring(0, 10)),
        deleted: ""
      }
    );
  }

  update(data) {
    db.collection("courses")
      .doc(this.id)
      .update(data);
  }

  delete() {
    db.collection("courses")
      .doc(this.id)
      .update({ deleted: new Date().toISOString() });
  }

  undelete() {
    db.collection("courses")
      .doc(this.id)
      .update({ deleted: "" });
  }

  done() {
    console.log("TEST");
    db.collection("courses")
      .doc(this.id)
      .update({ doneDate: new Date().toISOString() });
  }

  undone() {
    db.collection("courses")
      .doc(this.id)
      .update({ doneDate: "" });
  }

  get direction() {
    if (this.ref) {
      let _ref = this.ref.split(".");
      return _ref[_ref.length - 1];
    }
    return "";
  }

  get prettyDay() {
    return new Date(this.date).toLocaleDateString("fr-FR", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  }

  get prettyTime() {
    return this.time || "--:--";
  }

  get color() {
    if (this.patient) {
      return this.patient.color;
    } else {
      return "grey";
    }
  }
}
