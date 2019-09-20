import { Model } from "@vuex-orm/core";
import Course from "./Course";
import { db } from "../store/db";

export default class Chauffeur extends Model {
  static entity = "chauffeurs";

  static fields() {
    return {
      id: this.string(""),
      name: this.string(""),
      courses: this.hasMany(Course, "chauffeur_id")
    };
  }

  static create() {
    db.collection("chauffeurs").add({ name: "Nouveau chauffeur" });
  }

  update(data) {
    db.collection("chauffeurs")
      .doc(this.id)
      .update(data);
  }

  delete() {
    db.collection("chauffeurs")
      .doc(this.id)
      .delete();
  }
}
