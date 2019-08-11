import { Model } from "@vuex-orm/core";
import User from "./User";
import Course from "./Course";

export default class Patient extends Model {
  static entity = "patients";

  static fields() {
    return {
      id: this.increment(),
      name: this.string(""),
      title: this.string(""),
      type: this.string(""),
      done: this.boolean(false),
      assignee: this.belongsTo(User, "user_id"),
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
