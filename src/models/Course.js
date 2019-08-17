import { Model } from "@vuex-orm/core";
import Chauffeur from "./Chauffeur";
import Patient from "./Patient";

export default class Course extends Model {
  static entity = "courses";

  static fields() {
    return {
      id: this.increment(),
      ref: this.string(),
      chauffeur_id: this.number(),
      chauffeur: this.belongsTo(Chauffeur, "chauffeur_id"),
      patient_id: this.number(),
      patient: this.belongsTo(Patient, "patient_id"),
      date: this.string(new Date().toISOString().substring(0, 10)),
      time: this.string(""),
      generated: this.boolean(false)
    };
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
