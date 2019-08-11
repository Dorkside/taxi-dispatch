import { Model } from "@vuex-orm/core";
import Course from "./Course";

export default class Patient extends Model {
  static entity = "patients";

  static fields() {
    return {
      id: this.increment(),
      name: this.string(""),
      type: this.string("Consultation"),
      courses: this.hasMany(Course, "patient_id")
    };
  }

  color() {
    switch (this.type) {
      case "Dialyse":
        return "blue";
      default:
        return "green";
    }
  }
}
