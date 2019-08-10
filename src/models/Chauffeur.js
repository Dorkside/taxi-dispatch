import { Model } from "@vuex-orm/core";
import Course from "./Course";

export default class Chauffeur extends Model {
  static entity = "chauffeurs";

  static fields() {
    return {
      id: this.increment(),
      name: this.string(""),
      courses: this.hasMany(Course, "chauffeur_id")
    };
  }
}
