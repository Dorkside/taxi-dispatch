import { Model } from "@vuex-orm/core";
import Chauffeur from "./Chauffeur";
import Patient from "./Patient";

export default class Course extends Model {
  static entity = "courses";

  static fields() {
    return {
      id: this.increment(),
      chauffeur_id: this.number(0),
      chauffeur: this.belongsTo(Chauffeur, "chauffeur_id"),
      patient: this.belongsTo(Patient, "patient_id"),
      time: this.string()
    };
  }
}
