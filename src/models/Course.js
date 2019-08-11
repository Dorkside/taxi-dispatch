import { Model } from "@vuex-orm/core";
import Chauffeur from "./Chauffeur";
import Patient from "./Patient";

export default class Course extends Model {
  static entity = "courses";

  static fields() {
    return {
      id: this.increment(),
      chauffeur_id: this.number(1),
      chauffeur: this.belongsTo(Chauffeur, "chauffeur_id"),
      patient_id: this.number(1),
      patient: this.belongsTo(Patient, "patient_id"),
      date: this.string(new Date().toISOString().substring(0, 10)),
      time: this.string("")
    };
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
}
