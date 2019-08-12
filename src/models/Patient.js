import { Model } from "@vuex-orm/core";
import Course from "./Course";

export default class Patient extends Model {
  static entity = "patients";

  static fields() {
    return {
      id: this.increment(),
      name: this.string(""),
      type: this.string("Consultation"),
      courses: this.hasMany(Course, "patient_id"),
      lundi: this.string(""),
      mardi: this.string(""),
      mercredi: this.string(""),
      jeudi: this.string(""),
      vendredi: this.string(""),
      samedi: this.string("")
    };
  }

  get color() {
    switch (this.type) {
      case "Dialyse":
        return "blue";
      case "HDJ":
        return "red";
      case "Kiné / Rééducation":
        return "black";
      case "Consultation":
        return "green";
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

  prettyTime(day) {
    return this[day.toLowerCase()] || "--:--";
  }
}
