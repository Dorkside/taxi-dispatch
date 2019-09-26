import { Model } from "@vuex-orm/core";
import Course from "./Course";
import { db } from "../store/db";

export default class Chauffeur extends Model {
  static entity = "chauffeurs";

  static fields() {
    return {
      id: this.string(""),
      name: this.string(""),
      courses: this.hasMany(Course, "chauffeur_id"),
      deleted: this.string("")
    };
  }

  static create() {
    db.collection("chauffeurs").add({
      name: "Nouveau chauffeur",
      deleted: ""
    });
  }

  update(data) {
    db.collection("chauffeurs")
      .doc(this.id)
      .update(data);
  }

  delete() {
    Course.query()
      .where("chauffeur_id", this.$id)
      .get()
      .forEach(course => {
        course.update({ chauffeur_id: null });
      });
    db.collection("chauffeurs")
      .doc(this.id)
      .update({ deleted: new Date().toISOString() });
  }
}
